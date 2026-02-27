package smoke

import "testing"

func TestAdd(t *testing.T) {
	t.Parallel()

	got := Add(2, 3)
	want := 5
	if got != want {
		t.Fatalf("Add(2, 3) = %d, want %d", got, want)
	}
}
