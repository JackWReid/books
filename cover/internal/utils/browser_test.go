package utils

import (
	"testing"
)

func TestOpenURLUnsupportedOS(t *testing.T) {
	err := openURLWithOS("http://example.com", "plan9")
	if err == nil {
		t.Error("expected error for unsupported OS, got nil")
	}
}

// Note: For real browser opening, use integration tests or mock exec.Command.
