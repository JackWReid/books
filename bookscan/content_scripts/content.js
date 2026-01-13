// Content script that runs on web pages
console.log('Hello World Extension: Content script loaded!');

// Listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    // Extract the main content from the page
    const content = extractPageContent();
    sendResponse({ content: content });
  }
});

function extractPageContent() {
  // Try to get the main content area
  let content = '';
  
  // Common selectors for main content
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.main-content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '#content',
    '#main'
  ];
  
  // Try to find main content using selectors
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      content = element.textContent;
      break;
    }
  }
  
  // If no main content found, use the body
  if (!content) {
    content = document.body.textContent;
  }
  
  // Clean up the content
  content = content
    .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
    .replace(/\n+/g, ' ')  // Replace newlines with spaces
    .trim();
  
  return content;
}

// Show a small indicator that the extension is active
function showExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'bookscan-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 10000;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  `;
  indicator.textContent = '📚 Bookscan Active';
  
  indicator.addEventListener('click', () => {
    alert('Bookscan extension is active on this page! Click the extension icon in your toolbar to scan for books.');
  });
  
  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.05)';
  });
  
  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)';
  });
  
  document.body.appendChild(indicator);
  
  // Remove indicator after 5 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 5000);
}

// Show indicator when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showExtensionIndicator);
} else {
  showExtensionIndicator();
} 