import { LanguageConfig, SupportedLanguage } from '../types';

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: 'python',
    name: 'Python',
    badge: 'PY',
    extension: '.py',
    prismLang: 'python',
    compilerName: 'Python 3.12 (CPython)',
    iconColor: '#38bdf8', // sky blue
    placeholderCode: `# Paste or write your Python code here
def calculate_average(numbers):
    total = 0
    for i in range(len(numbers)):
        total += numbers[i]
    # Off by one or empty list error
    return total / len(numbers)

scores = []
print("Average score:", calculate_average(scores))`
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript / Node',
    badge: 'JS',
    extension: '.js',
    prismLang: 'javascript',
    compilerName: 'V8 / Node.js 20',
    iconColor: '#facc15', // yellow
    placeholderCode: `// Paste or write your JavaScript code here
async function fetchUserProfile(userId) {
  const response = await fetch('/api/user/' + userId);
  const data = response.json(); // Missing await!
  console.log("User name:", data.profile.name); // TypeError: Cannot read properties of undefined
  return data;
}

fetchUserProfile("user_101");`
  },
  c: {
    id: 'c',
    name: 'C Language',
    badge: 'C',
    extension: '.c',
    prismLang: 'c',
    compilerName: 'GCC 13 (C17 / C99)',
    iconColor: '#60a5fa', // blue
    placeholderCode: `// Paste or write your C code here
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = NULL;
    printf("Accessing value: %d\\n", *ptr); // Segmentation Fault!
    return 0;
}`
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    badge: 'C++',
    extension: '.cpp',
    prismLang: 'cpp',
    compilerName: 'G++ 13 (C++20)',
    iconColor: '#818cf8', // indigo
    placeholderCode: `// Paste or write your C++ code here
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30};
    // std::out_of_range error
    std::cout << "Element at 5: " << numbers.at(5) << std::endl;
    return 0;
}`
  },
  java: {
    id: 'java',
    name: 'Java',
    badge: 'JAVA',
    extension: '.java',
    prismLang: 'java',
    compilerName: 'OpenJDK 21 (JVM)',
    iconColor: '#fb923c', // orange
    placeholderCode: `// Paste or write your Java code here
public class Main {
    public static void main(String[] args) {
        String message = null;
        // Throws NullPointerException!
        if (message.equalsIgnoreCase("HELLO")) {
            System.out.println("Greeting received");
        }
    }
}`
  },
  html_css: {
    id: 'html_css',
    name: 'HTML / CSS',
    badge: 'HTML',
    extension: '.html',
    prismLang: 'markup',
    compilerName: 'Browser DOM / CSS3 Engine',
    iconColor: '#f87171', // red-rose
    placeholderCode: `<!-- Paste or write your HTML/CSS code here -->
<!DOCTYPE html>
<html>
<head>
  <style>
    .card-container {
      display: flex
      justify-content: center; /* Missing semicolon above! */
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card">
      <h2>Welcome to CodeCraft</h2>
      <p>Card content here...
    <!-- Missing closing div tags -->
</body>
</html>`
  }
};
