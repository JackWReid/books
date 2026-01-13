package utils

import (
	"fmt"
	"os/exec"
	"runtime"
)

// OpenURL opens a URL in the default browser
func OpenURL(url string) error {
	return openURLWithOS(url, runtime.GOOS)
}

// openURLWithOS opens a URL using the specified OS (for testing)
func openURLWithOS(url, os string) error {
	var cmd *exec.Cmd

	switch os {
	case "darwin":
		cmd = exec.Command("open", url)
	case "linux":
		cmd = exec.Command("xdg-open", url)
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	default:
		return fmt.Errorf("unsupported operating system: %s", os)
	}

	return cmd.Start()
}

// OpenHardcoverURL opens a book's Hardcover page
func OpenHardcoverURL(slug string) error {
	url := fmt.Sprintf("https://hardcover.app/book/%s", slug)
	return OpenURL(url)
}

// OpenGoodreadsURL opens a book's Goodreads page
func OpenGoodreadsURL(url string) error {
	return OpenURL(url)
}

// OpenOkuURL opens a book's Oku page
func OpenOkuURL(url string) error {
	return OpenURL(url)
}
