document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const settingsSection = document.getElementById('settingsSection');
  const scanSection = document.getElementById('scanSection');
  const toggleSettingsBtn = document.getElementById('toggleSettings');
  const saveKeysBtn = document.getElementById('saveKeys');
  const scanButton = document.getElementById('scanButton');
  const openaiKeyInput = document.getElementById('openaiKey');
  const hardcoverKeyInput = document.getElementById('hardcoverKey');
  const keysMessage = document.getElementById('keysMessage');
  const scanStatus = document.getElementById('scanStatus');
  const resultsSection = document.getElementById('resultsSection');
  const booksList = document.getElementById('booksList');
  const toggleDebugBtn = document.getElementById('toggleDebug');
  const debugSection = document.getElementById('debugSection');
  const debugContent = document.getElementById('debugContent');
  const debugTabs = document.querySelectorAll('.debug-tab');

  // Debug data storage
  let debugData = {
    pageContent: '',
    simplifiedContent: '',
    openaiRequest: '',
    openaiResponse: '',
    parsedBooks: [],
    hardcoverRequests: []
  };

  // Load saved API keys
  loadApiKeys();

  // Event listeners
  toggleSettingsBtn.addEventListener('click', toggleSettings);
  saveKeysBtn.addEventListener('click', saveApiKeys);
  scanButton.addEventListener('click', scanPageForBooks);
  
  // Auto-save keys as user types
  openaiKeyInput.addEventListener('input', autoSaveKeys);
  hardcoverKeyInput.addEventListener('input', autoSaveKeys);

  function loadApiKeys() {
    browser.storage.local.get(['openaiKey', 'hardcoverKey']).then((result) => {
      if (result.openaiKey) {
        openaiKeyInput.value = result.openaiKey;
      }
      if (result.hardcoverKey) {
        hardcoverKeyInput.value = result.hardcoverKey;
      }
      
      // Show scan section if both keys are present
      if (result.openaiKey && result.hardcoverKey) {
        showScanSection();
      }
    });
  }

  function autoSaveKeys() {
    const openaiKey = openaiKeyInput.value.trim();
    const hardcoverKey = hardcoverKeyInput.value.trim();
    
    // Save keys as they're typed (even if incomplete)
    browser.storage.local.set({
      openaiKey: openaiKey,
      hardcoverKey: hardcoverKey
    }).then(() => {
      // Check if both keys are complete and valid
      if (openaiKey && hardcoverKey) {
        if (openaiKey.startsWith('sk-') && hardcoverKey.startsWith('Bearer ')) {
          showScanSection();
        }
      }
    }).catch((error) => {
      console.error('Error auto-saving API keys:', error);
    });
  }

  function saveApiKeys() {
    const openaiKey = openaiKeyInput.value.trim();
    const hardcoverKey = hardcoverKeyInput.value.trim();

    if (!openaiKey || !hardcoverKey) {
      showMessage(keysMessage, 'Please enter both API keys', 'error');
      return;
    }

    // Validate key formats
    if (!openaiKey.startsWith('sk-')) {
      showMessage(keysMessage, 'OpenAI API key should start with "sk-"', 'error');
      return;
    }

    if (!hardcoverKey.startsWith('Bearer ')) {
      showMessage(keysMessage, 'Hardcover API key should start with "Bearer "', 'error');
      return;
    }

    browser.storage.local.set({
      openaiKey: openaiKey,
      hardcoverKey: hardcoverKey
    }).then(() => {
      showMessage(keysMessage, 'API keys saved successfully!', 'success');
      showScanSection();
    }).catch((error) => {
      showMessage(keysMessage, 'Error saving API keys', 'error');
      console.error('Error saving API keys:', error);
    });
  }

  function toggleSettings() {
    if (settingsSection.style.display === 'none') {
      settingsSection.style.display = 'block';
      scanSection.style.display = 'none';
      toggleSettingsBtn.textContent = '🔍 Scan';
    } else {
      settingsSection.style.display = 'none';
      scanSection.style.display = 'block';
      toggleSettingsBtn.textContent = '⚙️ Settings';
    }
  }

  function showScanSection() {
    settingsSection.style.display = 'none';
    scanSection.style.display = 'block';
    toggleSettingsBtn.textContent = '⚙️ Settings';
  }

  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
      element.textContent = '';
      element.className = 'message';
    }, 3000);
  }

  async function scanPageForBooks() {
    scanButton.disabled = true;
    scanStatus.innerHTML = '<span class="loading"></span> Scanning page...';
    resultsSection.style.display = 'none';
    booksList.innerHTML = '';

    try {
      // Get the active tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      // Get page content
      const pageContent = await getPageContent(tab.id);
      
      // Extract book information using OpenAI
      const books = await extractBooksWithOpenAI(pageContent);
      
      // Search for books on Hardcover
      const enrichedBooks = await searchBooksOnHardcover(books);
      
      // Display results
      displayBooks(enrichedBooks);
      
    } catch (error) {
      console.error('Error scanning page:', error);
      scanStatus.textContent = 'Error scanning page. Please try again.';
    } finally {
      scanButton.disabled = false;
    }
  }

  async function getPageContent(tabId) {
    return new Promise((resolve, reject) => {
      browser.tabs.sendMessage(tabId, { action: 'getPageContent' })
        .then(response => {
          if (response && response.content) {
            resolve(response.content);
          } else {
            reject(new Error('No content received from page'));
          }
        })
        .catch(reject);
    });
  }

  async function extractBooksWithOpenAI(pageContent) {
    const apiKey = openaiKeyInput.value.trim();
    // Simplify the content to reduce token usage
    const simplifiedContent = simplifyContent(pageContent);
    debugData.simplifiedContent = simplifiedContent;
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts book titles and authors from web page content. Return only a JSON array of objects with "title" and "author" fields. If no books are found, return an empty array.'
        },
        {
          role: 'user',
          content: `Extract book titles and authors from this web page content. Return only valid JSON:\n\n${simplifiedContent}`
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    };
    debugData.openaiRequest = JSON.stringify(requestBody, null, 2);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    debugData.openaiResponse = JSON.stringify(data, null, 2);
    const content = data.choices[0].message.content;
    let jsonContent;
    try {
      // Remove markdown code block markers if present
      jsonContent = content.trim();
      // Remove ```json or ``` at the start
      jsonContent = jsonContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
      // Remove trailing ```
      jsonContent = jsonContent.replace(/\s*```$/, '');
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', content);
      console.error('Cleaned content:', jsonContent);
      console.error('Parse error:', error);
      return [];
    }
  }

  function simplifyContent(content) {
    // Remove HTML tags and limit content length
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textContent.substring(0, 2000); // Limit to 2000 characters
  }

  async function searchBooksOnHardcover(books) {
    const hardcoverKey = hardcoverKeyInput.value.trim();
    const enrichedBooks = [];

    for (const book of books) {
      try {
        const searchQuery = `${book.title} ${book.author}`.trim();
        const requestBody = {
          query: `
            query Search($query: String!) {
              search(query: $query, query_type: "books", per_page: 1, page: 1, sort: "activities_count:desc") {
                results
              }
            }
          `,
          variables: {
            query: searchQuery
          }
        };
        debugData.hardcoverRequests.push({
          book: book,
          request: requestBody,
          response: null,
          status: null,
          rawResponse: null,
          error: null
        });
        const response = await fetch('https://api.hardcover.app/v1/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': hardcoverKey
          },
          body: JSON.stringify(requestBody)
        });
        const lastRequestIndex = debugData.hardcoverRequests.length - 1;
        debugData.hardcoverRequests[lastRequestIndex].status = response.status;
        let responseText = await response.text();
        debugData.hardcoverRequests[lastRequestIndex].rawResponse = responseText;
        let responseData = null;
        try {
          responseData = JSON.parse(responseText);
          debugData.hardcoverRequests[lastRequestIndex].response = responseData;
        } catch (e) {
          debugData.hardcoverRequests[lastRequestIndex].error = 'Invalid JSON: ' + e.message;
        }
        // Use results object directly, not JSON.parse
        if (
          response.ok &&
          responseData &&
          responseData.data &&
          responseData.data.search &&
          responseData.data.search.results &&
          Array.isArray(responseData.data.search.results.hits) &&
          responseData.data.search.results.hits.length > 0
        ) {
          const hardcoverBook = responseData.data.search.results.hits[0].document;
          enrichedBooks.push({
            ...book,
            hardcoverId: hardcoverBook.id,
            hardcoverSlug: hardcoverBook.slug,
            found: true
          });
          continue;
        }
        enrichedBooks.push({
          ...book,
          found: false
        });
      } catch (error) {
        console.error('Error searching Hardcover:', error);
        const lastRequestIndex = debugData.hardcoverRequests.length - 1;
        if (lastRequestIndex >= 0) {
          debugData.hardcoverRequests[lastRequestIndex].error = error.message;
        }
        enrichedBooks.push({
          ...book,
          found: false
        });
      }
    }
    return enrichedBooks;
  }

  function displayBooks(books) {
    if (books.length === 0) {
      scanStatus.textContent = 'No books found on this page.';
      return;
    }

    scanStatus.textContent = `Found ${books.length} book(s)`;
    resultsSection.style.display = 'block';

    booksList.innerHTML = books.map((book, idx) => `
      <div class="book-item">
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
        <div class="book-actions">
          ${book.found ? 
            `<button class="add-hardcover" id="addHardcoverBtn-${idx}">Add to Hardcover</button>` :
            `<button class="add-hardcover" disabled>Not found on Hardcover</button>`
          }
          <button class="add-goodreads" id="goodreadsBtn-${idx}">Copy & Search Goodreads</button>
          <button class="add-oku" id="okuBtn-${idx}">Copy & Search Oku</button>
        </div>
      </div>
    `).join('');

    // Attach event listeners after rendering
    books.forEach((book, idx) => {
      const hardcoverBtn = document.getElementById(`addHardcoverBtn-${idx}`);
      if (hardcoverBtn) {
        hardcoverBtn.addEventListener('click', () => addToHardcoverWithSpinner(book.hardcoverId, book.title, idx));
      }
      const goodreadsBtn = document.getElementById(`goodreadsBtn-${idx}`);
      if (goodreadsBtn) {
        goodreadsBtn.addEventListener('click', () => copyAndOpenGoodreads(book.title, book.author));
      }
      const okuBtn = document.getElementById(`okuBtn-${idx}`);
      if (okuBtn) {
        okuBtn.addEventListener('click', () => copyAndOpenOku(book.title, book.author));
      }
    });
  }

  function showStatusMessage(type, message) {
    const statusBox = document.getElementById('statusBox');
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `status-box ${type}`;
    statusBox.style.display = 'block';
    clearTimeout(statusBox._timeout);
    statusBox._timeout = setTimeout(() => {
      statusBox.style.display = 'none';
      statusBox.textContent = '';
      statusBox.className = 'status-box';
    }, type === 'error' ? 5000 : 3000);
  }

  function addToHardcoverWithSpinner(bookId, title, idx) {
    console.log('Add to Hardcover clicked', bookId, title, idx);
    const hardcoverKey = hardcoverKeyInput.value.trim();
    const btn = document.getElementById(`addHardcoverBtn-${idx}`);
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading" style="margin-right:6px;"></span>Adding...';
    btn.disabled = true;
    fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': hardcoverKey
      },
      body: JSON.stringify({
        query: `
          mutation AddToWantToRead($bookId: Int!) {
            insert_user_book(object: {book_id: $bookId, status_id: 1}) {
              id
            }
          }
        `,
        variables: {
          bookId: parseInt(bookId)
        }
      })
    })
      .then(response => {
        if (response.ok) {
          showStatusMessage('success', `"${title}" added to your Want to Read list on Hardcover!`);
        } else {
          showStatusMessage('error', 'Error adding book to Hardcover. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error adding to Hardcover:', error);
        showStatusMessage('error', 'Error adding book to Hardcover. Please try again.');
      })
      .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      });
  }

  function copyAndOpenGoodreads(title, author) {
    console.log('Goodreads clicked', title, author);
    const searchUrl = `https://www.goodreads.com/search?q=${encodeURIComponent(title + ' ' + author)}`;
    window.open(searchUrl, '_blank');
    showStatusMessage('info', 'Opened Goodreads search in a new tab.');
  }

  function copyAndOpenOku(title, author) {
    console.log('Oku clicked', title, author);
    const text = `${title} ${author}`;
    navigator.clipboard.writeText(text).then(() => {
      window.open(`https://oku.club/explore/books`, '_blank');
      showStatusMessage('info', 'Book info copied to clipboard! Paste it into the Oku search box.');
    }).catch(() => {
      showStatusMessage('error', 'Failed to copy to clipboard.');
    });
  }

  // Global functions for button actions
  window.addToHardcover = async function(bookId, title) {
    const hardcoverKey = hardcoverKeyInput.value.trim();
    
    try {
      const response = await fetch('https://api.hardcover.app/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': hardcoverKey
        },
        body: JSON.stringify({
          query: `
            mutation AddToWantToRead($bookId: Int!) {
              insert_user_book(object: {book_id: $bookId, status_id: 1}) {
                id
              }
            }
          `,
          variables: {
            bookId: parseInt(bookId)
          }
        })
      });

      if (response.ok) {
        alert(`"${title}" added to your Want to Read list on Hardcover!`);
      } else {
        alert('Error adding book to Hardcover. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to Hardcover:', error);
      alert('Error adding book to Hardcover. Please try again.');
    }
  };

  window.searchGoodreads = function(title, author) {
    const searchUrl = `https://www.goodreads.com/search?q=${encodeURIComponent(title + ' ' + author)}`;
    browser.tabs.create({ url: searchUrl });
  };

  window.searchOku = function(title, author) {
    const searchUrl = `https://oku.club/search?q=${encodeURIComponent(title + ' ' + author)}`;
    browser.tabs.create({ url: searchUrl });
  };
}); 