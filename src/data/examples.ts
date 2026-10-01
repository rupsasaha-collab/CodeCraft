import { ExampleError } from '../types';

export const EXAMPLE_ERRORS: ExampleError[] = [
  // Python Examples
  {
    id: 'py-index-error',
    title: 'Python: List Index Out of Range',
    language: 'python',
    errorType: 'IndexError: list index out of range',
    difficulty: 'Beginner',
    tag: 'Off-by-One',
    description: 'Attempting to access an array or list position using an index equal to the list length (common loop boundary bug).',
    code: `names = ["Alice", "Bob", "Charlie"]

# Classic beginner error: <= instead of < or not using len(names)-1
for i in range(len(names) + 1):
    print(f"User {i}: {names[i]}")`,
    errorMessage: `Traceback (most recent call last):
  File "main.py", line 5, in <module>
    print(f"User {i}: {names[i]}")
IndexError: list index out of range`
  },
  {
    id: 'py-type-error',
    title: 'Python: Unhashable Type / String Concatenation',
    language: 'python',
    errorType: 'TypeError: can only concatenate str (not "int") to str',
    difficulty: 'Beginner',
    tag: 'Type Mismatch',
    description: 'Trying to concatenate a string and an integer directly with the + operator instead of formatting or converting.',
    code: `name = "Student"
score = 98

# Error: Python does not automatically coerce integers into strings with '+'
message = "Congratulations " + name + "! Your final exam score is " + score + " points."
print(message)`,
    errorMessage: `Traceback (most recent call last):
  File "main.py", line 5, in <module>
    message = "Congratulations " + name + "! Your final exam score is " + score + " points."
TypeError: can only concatenate str (not "int") to str`
  },
  {
    id: 'py-zero-division',
    title: 'Python: ZeroDivisionError & Empty List',
    language: 'python',
    errorType: 'ZeroDivisionError: division by zero',
    difficulty: 'Beginner',
    tag: 'Arithmetic Exception',
    description: 'Calculating the average of an empty data list without validating whether the length is greater than 0.',
    code: `def get_average(grades):
    return sum(grades) / len(grades)

user_grades = []
result = get_average(user_grades)
print("Average:", result)`,
    errorMessage: `Traceback (most recent call last):
  File "grade_calc.py", line 2, in get_average
    return sum(grades) / len(grades)
ZeroDivisionError: division by zero`
  },

  // C Language Examples
  {
    id: 'c-segfault-scanf',
    title: 'C: Segmentation Fault with scanf()',
    language: 'c',
    errorType: 'Segmentation fault (core dumped)',
    difficulty: 'Beginner',
    tag: 'Pointers & Memory',
    description: 'Passing the value of an integer instead of its memory address (&age) to scanf(), causing memory corruption.',
    code: `#include <stdio.h>

int main() {
    int age;
    printf("Please enter your age: ");
    
    // Bug: Missing '&' address-of operator!
    scanf("%d", age); 
    
    printf("You are %d years old.\\n", age);
    return 0;
}`,
    errorMessage: `Segmentation fault (core dumped)
Process finished with exit code 139`
  },
  {
    id: 'c-dangling-pointer',
    title: 'C: Returning Pointer to Local Stack Variable',
    language: 'c',
    errorType: 'Warning: function returns address of local variable',
    difficulty: 'Intermediate',
    tag: 'Stack Lifetime',
    description: 'Returning a pointer to a stack-allocated variable that gets destroyed as soon as the function returns.',
    code: `#include <stdio.h>

int* create_counter() {
    int count = 10;
    // Bug: 'count' is allocated on the stack frame of create_counter!
    return &count;
}

int main() {
    int* ptr = create_counter();
    printf("Counter value: %d\\n", *ptr); // Undefined behavior / garbage value
    return 0;
}`,
    errorMessage: `main.c: In function 'create_counter':
main.c:6:12: warning: function returns address of local variable [-Wreturn-local-addr]
    6 |     return &count;
      |            ^~~~~~`
  },

  // C++ Examples
  {
    id: 'cpp-vector-out-of-range',
    title: 'C++: std::out_of_range Exception',
    language: 'cpp',
    errorType: 'terminate called after throwing an instance of \'std::out_of_range\'',
    difficulty: 'Beginner',
    tag: 'STL Vector',
    description: 'Using vector::at() with an index outside the valid size bounds throws a checked std::out_of_range exception.',
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<std::string> fruits = {"Apple", "Banana", "Cherry"};

    // Vector has 3 elements (indices 0, 1, 2)
    for (size_t i = 0; i <= fruits.size(); ++i) {
        std::cout << "Fruit " << i << ": " << fruits.at(i) << std::endl;
    }

    return 0;
}`,
    errorMessage: `terminate called after throwing an instance of 'std::out_of_range'
  what():  vector::_M_range_check: __n (which is 3) >= this->size() (which is 3)
Aborted (core dumped)`
  },
  {
    id: 'cpp-uninitialized-variable',
    title: 'C++: Infinite Recursion / Stack Overflow',
    language: 'cpp',
    errorType: 'Segmentation fault (Stack Overflow)',
    difficulty: 'Beginner',
    tag: 'Recursion Base Case',
    description: 'A recursive factorial function missing the base case termination condition for n <= 1.',
    code: `#include <iostream>

long long factorial(int n) {
    // Bug: Missing base case 'if (n <= 1) return 1;'!
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    std::cout << "Factorial of " << num << " is " << factorial(num) << std::endl;
    return 0;
}`,
    errorMessage: `Segmentation fault (core dumped)
Call stack exceeded maximum execution depth (stack overflow)`
  },

  // Java Examples
  {
    id: 'java-null-pointer',
    title: 'Java: java.lang.NullPointerException',
    language: 'java',
    errorType: 'java.lang.NullPointerException',
    difficulty: 'Beginner',
    tag: 'Null Safety',
    description: 'Calling an instance method on a variable reference that currently holds null.',
    code: `public class StringProcessor {
    public static void main(String[] args) {
        String userInput = null;
        
        // Bug: Calling toUpperCase() on a null reference
        String formatted = userInput.toUpperCase();
        System.out.println("Result: " + formatted);
    }
}`,
    errorMessage: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "userInput" is null
\tat StringProcessor.main(StringProcessor.java:6)`
  },
  {
    id: 'java-array-bounds',
    title: 'Java: ArrayIndexOutOfBoundsException',
    language: 'java',
    errorType: 'java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5',
    difficulty: 'Beginner',
    tag: 'Array Indexing',
    description: 'Accessing array element at index == length instead of length - 1.',
    code: `public class ArrayTester {
    public static void main(String[] args) {
        int[] scores = {85, 92, 78, 90, 88};
        
        // Bug: Loop runs while i <= scores.length instead of i < scores.length
        for (int i = 0; i <= scores.length; i++) {
            System.out.println("Score " + i + ": " + scores[i]);
        }
    }
}`,
    errorMessage: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5
\tat ArrayTester.main(ArrayTester.java:6)`
  },

  // JavaScript Examples
  {
    id: 'js-cannot-read-undefined',
    title: 'JavaScript: Cannot read property of undefined',
    language: 'javascript',
    errorType: 'TypeError: Cannot read properties of undefined (reading \'map\')',
    difficulty: 'Beginner',
    tag: 'Async / Data Fetching',
    description: 'Trying to invoke .map() on an API response object where the expected array property is undefined or not awaited.',
    code: `async function renderProductList() {
    // Simulating an API response
    const response = {
        status: "success",
        // Notice: the field is called 'items', not 'products'!
        items: [{ id: 1, name: "Keyboard" }, { id: 2, name: "Mouse" }]
    };

    // Bug: response.products is undefined!
    const productNames = response.products.map(p => p.name);
    console.log("Products:", productNames);
}

renderProductList();`,
    errorMessage: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at renderProductList (app.js:10:44)
    at app.js:14:1`
  },
  {
    id: 'js-modify-const',
    title: 'JavaScript: Assignment to constant variable',
    language: 'javascript',
    errorType: 'TypeError: Assignment to constant variable.',
    difficulty: 'Beginner',
    tag: 'Variable Declaration',
    description: 'Attempting to reassign a variable declared with const keyword in a loop or calculation.',
    code: `function calculateTotal(prices) {
    // Bug: Declared total with const, then reassigning it in the loop
    const total = 0;
    
    for (let price of prices) {
        total = total + price; // Error!
    }
    
    return total;
}

console.log(calculateTotal([19.99, 4.50, 12.00]));`,
    errorMessage: `TypeError: Assignment to constant variable.
    at calculateTotal (calc.js:6:15)
    at calc.js:12:13`
  },

  // HTML / CSS Examples
  {
    id: 'html-unclosed-tags',
    title: 'HTML/CSS: Broken Layout & Unclosed Tags',
    language: 'html_css',
    errorType: 'HTML Validation Error: Unclosed <div> and CSS syntax warning',
    difficulty: 'Beginner',
    tag: 'DOM Hierarchy & CSS',
    description: 'An unclosed wrapper div causing all subsequent sections to nest improperly, combined with missing semicolons.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <style>
    .grid-container {
      display: grid
      grid-template-columns: 1fr 1fr; /* Missing semicolon on display: grid! */
      gap: 16px;
    }
    .footer {
      background: #1e293b;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <div class="card">
      <h3>Card 1</h3>
      <p>Data visualization</p>
    <!-- Bug: Missing closing </div> for .card! -->

    <div class="card">
      <h3>Card 2</h3>
      <p>System metrics</p>
    </div>
  </div>

  <footer class="footer">
    <p>&copy; 2026 CodeCraft</p>
  </footer>
</body>
</html>`,
    errorMessage: `CSS Syntax Warning: Expected ';' at line 8:7
HTML Validator Warning: Tag <div> at line 20 was not closed before opening sibling <div> at line 24.
Layout collapsed: grid properties ignored due to parsing failure.`
  }
];
