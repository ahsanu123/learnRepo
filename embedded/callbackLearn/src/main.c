#include <stdio.h>
#include <stdlib.h>

typedef int (*compare_fn_t)(const void *, const void *);

void sort_array(int *arr, size_t n, compare_fn_t compare) {
  qsort(arr, n, sizeof(int), compare);
}

int ascending_order(const void *a, const void *b) {
  const int *ia = (const int *)a;
  const int *ib = (const int *)b;
  return (*ia > *ib) - (*ia < *ib);
}
int descending_order(const void *a, const void *b) {
  const int *ia = (const int *)a;
  const int *ib = (const int *)b;
  return (*ib > *ia) - (*ib < *ia);
}

int main() {
  int arr[] = {7, 2, 0, 5, 8, 9};

  size_t n = sizeof(arr) / sizeof(arr[0]);

  return 0;
}
