# Bookscan Firefox Extension

A Firefox plugin for scanning web pages for book references and providing links to add them to reading lists on Hardcover, Goodreads, and Oku.

The extension uses OpenAI's `GPT-4o-mini` model to scan a simplified version of the page's content to find book titles and authors. Using this list, it searches for the books using the Hardcover API and provides options to add them to your reading lists.

## Features

- **Smart Book Detection**: Uses OpenAI's GPT-4o-mini to intelligently extract book titles and authors from web page content
- **Hardcover Integration**: Searches for books on Hardcover and allows direct addition to your "Want to Read" list
- **Multiple Platform Support**: Provides quick links to search for books on Goodreads and Oku
- **Secure API Key Storage**: Stores your API keys locally in the browser
- **Modern UI**: Clean, gradient-based design with smooth animations and intuitive interface
- **Content Script**: Automatically runs on web pages to show extension activity

## Prerequisites

Before using the extension, you'll need:

1. **OpenAI API Key**: Get one from [OpenAI's platform](https://platform.openai.com/api-keys)
2. **Hardcover API Key**: Get one from [Hardcover's account settings](https://hardcover.app/account/api)

## Project Structure

```
bookscan/
├── manifest.json              # Extension manifest file
├── popup/
│   ├── popup.html            # Popup interface HTML
│   ├── popup.css             # Popup styling
│   └── popup.js              # Popup functionality
├── content_scripts/
│   └── content.js            # Content script for web pages
├── icons/
│   ├── icon-48.png           # 48x48 extension icon
│   └── icon-96.png           # 96x96 extension icon
├── test-page.html            # Test page for demonstration
└── README.md                 # This file
```

## Installation

### For Development/Testing

1. **Open Firefox** and navigate to `about:debugging`
2. Click on **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on..."**
4. Select the `manifest.json` file from this project directory
5. The extension should now appear in your toolbar

### For Production Distribution

1. Create a ZIP file containing all the project files
2. Submit to [Firefox Add-ons](https://addons.mozilla.org/developers/) for review
3. Once approved, users can install from the Firefox Add-ons store

## Usage

### Initial Setup

1. **Install the extension** following the installation instructions above
2. **Click the Bookscan icon** in your Firefox toolbar
3. **Enter your API keys**:
   - OpenAI API Key (starts with `sk-`)
   - Hardcover API Key (starts with `Bearer `)
4. **Click "Save Keys"** to store them securely

### Scanning for Books

1. **Navigate to any web page** that contains book references
2. **Click the Bookscan extension icon** in your toolbar
3. **Click "Scan Page for Books"** to analyze the page content
4. **Review the results** - the extension will show detected books with options to:
   - Add to your Hardcover "Want to Read" list (if found on Hardcover)
   - Search on Goodreads
   - Search on Oku

### Testing the Extension

Use the included `test-page.html` file to test the extension:
1. Open `test-page.html` in Firefox
2. Click the Bookscan extension icon
3. Scan the page to see the extension in action

## How It Works

### Book Detection Process
1. **Content Extraction**: The content script extracts the main content from the web page
2. **AI Analysis**: The page content is sent to OpenAI's GPT-4o-mini model to identify book titles and authors
3. **Hardcover Search**: Each detected book is searched on Hardcover to find matching entries
4. **Results Display**: Books are displayed with options to add them to reading lists

### API Integration
- **OpenAI API**: Used for intelligent book detection from page content
- **Hardcover API**: Used for searching books and adding them to reading lists
- **External Links**: Direct links to Goodreads and Oku search pages

## Development

### Prerequisites

- Firefox browser
- OpenAI API key
- Hardcover API key
- Basic knowledge of HTML, CSS, and JavaScript

### Making Changes

1. **Modify the code** in the respective files
2. **Reload the extension** in `about:debugging` by clicking the "Reload" button
3. **Test your changes** by clicking the extension icon or visiting web pages

### Key Files to Modify

- `manifest.json`: Extension configuration, permissions, and structure
- `popup/popup.html`: Popup interface layout
- `popup/popup.css`: Popup styling and animations
- `popup/popup.js`: Core extension functionality
- `content_scripts/content.js`: Content script behavior on web pages

## API Usage

### OpenAI API
- **Model**: `gpt-4o-mini`
- **Purpose**: Extract book titles and authors from page content
- **Token Limit**: Content is limited to 2000 characters to minimize costs

### Hardcover API
- **Endpoint**: `https://api.hardcover.app/v1/graphql`
- **Operations**: Search books, add to reading lists
- **Authentication**: Bearer token

## Troubleshooting

### Extension Not Loading
- Check that `manifest.json` is valid JSON
- Ensure all referenced files exist
- Check Firefox console for error messages

### API Key Issues
- Verify your OpenAI API key is valid and has sufficient credits
- Ensure your Hardcover API key is correctly formatted (starts with "Bearer ")
- Check that both API keys are saved in the extension settings

### Book Detection Issues
- The AI model may not detect all books, especially if they're mentioned informally
- Try refreshing the page and scanning again
- Check the browser console for API error messages

### Hardcover Integration Issues
- Ensure your Hardcover API key has the necessary permissions
- Some books may not be found on Hardcover if they're not in their database
- Check the Hardcover API documentation for rate limits

## Security & Privacy

- **API Keys**: Stored locally in browser storage, never transmitted to third parties
- **Page Content**: Only the text content is sent to OpenAI for analysis
- **No Data Collection**: The extension doesn't collect or store any personal data

## Resources

- [Firefox Extension Development Guide](https://extensionworkshop.com/)
- [WebExtensions API Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Hardcover API Documentation](https://docs.hardcover.app/)

## License

This project is open source and available under the MIT License.
