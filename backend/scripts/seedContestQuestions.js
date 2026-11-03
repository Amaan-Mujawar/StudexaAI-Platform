// scripts/seedContestQuestions.js
// Run once: node scripts/seedContestQuestions.js

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import ContestQuestion from "../src/modules/contest/models/ContestQuestion.js";

const MONGO_URI = process.env.MONGO_URI;

const questions = [
    /* ─── DSA — Easy ─── */
    {
        topic: "DSA", difficulty: "easy",
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctIndex: 2,
        explanation: "Arrays store elements at contiguous memory locations, so random access is O(1).",
    },
    {
        topic: "DSA", difficulty: "easy",
        question: "Which data structure follows the LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Heap"],
        correctIndex: 1,
        explanation: "A Stack follows LIFO — the last element pushed is the first popped.",
    },
    {
        topic: "DSA", difficulty: "easy",
        question: "What is the worst-case time complexity of linear search?",
        options: ["O(1)", "O(log n)", "O(n log n)", "O(n)"],
        correctIndex: 3,
        explanation: "Linear search traverses all n elements in the worst case.",
    },
    {
        topic: "DSA", difficulty: "easy",
        question: "Which of the following is NOT a linear data structure?",
        options: ["Array", "Linked List", "Queue", "Binary Tree"],
        correctIndex: 3,
        explanation: "A Binary Tree is hierarchical (non-linear); arrays, linked lists, and queues are linear.",
    },
    /* ─── DSA — Medium ─── */
    {
        topic: "DSA", difficulty: "medium",
        question: "What is the time complexity of Binary Search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctIndex: 1,
        explanation: "Binary search halves the search space each step, giving O(log n).",
    },
    {
        topic: "DSA", difficulty: "medium",
        question: "In a Min-Heap, which element is always at the root?",
        options: ["The maximum element", "The median element", "The minimum element", "A random element"],
        correctIndex: 2,
        explanation: "In a Min-Heap, the root always holds the smallest element.",
    },
    {
        topic: "DSA", difficulty: "medium",
        question: "What is the space complexity of Merge Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2,
        explanation: "Merge Sort requires O(n) auxiliary space for the temporary arrays during merging.",
    },
    {
        topic: "DSA", difficulty: "medium",
        question: "Which traversal of a BST gives elements in sorted (ascending) order?",
        options: ["Pre-order", "Post-order", "In-order", "Level-order"],
        correctIndex: 2,
        explanation: "In-order traversal (Left → Root → Right) of a BST yields sorted ascending order.",
    },
    /* ─── DSA — Hard ─── */
    {
        topic: "DSA", difficulty: "hard",
        question: "What is the amortized time complexity of push and pop operations in a dynamic array?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctIndex: 3,
        explanation: "Although occasional resizing is O(n), amortized over many operations the cost is O(1).",
    },
    {
        topic: "DSA", difficulty: "hard",
        question: "In Dijkstra's algorithm using a min-priority queue, what is the overall time complexity for a graph with V vertices and E edges?",
        options: ["O(V²)", "O(E log V)", "O(VE)", "O(V log V)"],
        correctIndex: 1,
        explanation: "With a binary min-heap, each edge relaxation costs O(log V), giving O(E log V) total.",
    },
    /* ─── OOPs — Easy ─── */
    {
        topic: "OOPs", difficulty: "easy",
        question: "Which OOP concept allows a class to inherit properties from another class?",
        options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
        correctIndex: 2,
        explanation: "Inheritance allows a child class to acquire the fields and methods of a parent class.",
    },
    {
        topic: "OOPs", difficulty: "easy",
        question: "What is an object in Object-Oriented Programming?",
        options: ["A class definition", "An instance of a class", "A reserved keyword", "A standalone function"],
        correctIndex: 1,
        explanation: "An object is a runtime instance of a class with actual values assigned to its fields.",
    },
    {
        topic: "OOPs", difficulty: "easy",
        question: "Which keyword is used to create an instance of a class in most OOP languages?",
        options: ["this", "create", "new", "instanceof"],
        correctIndex: 2,
        explanation: "The `new` keyword allocates memory and calls the constructor to create an object.",
    },
    {
        topic: "OOPs", difficulty: "easy",
        question: "What does 'encapsulation' mean in OOP?",
        options: ["Hiding implementation details inside a class", "Creating multiple classes", "Overriding parent class methods", "Running multiple threads"],
        correctIndex: 0,
        explanation: "Encapsulation bundles data and methods together and hides internal details from outside.",
    },
    /* ─── OOPs — Medium ─── */
    {
        topic: "OOPs", difficulty: "medium",
        question: "What is method overriding?",
        options: ["Defining two methods with the same name in the same class", "A child class providing a new implementation for a parent method", "Calling a method using super()", "Hiding a method using the private modifier"],
        correctIndex: 1,
        explanation: "Method overriding lets a subclass replace the parent's implementation for runtime polymorphism.",
    },
    {
        topic: "OOPs", difficulty: "medium",
        question: "Which OOP principle ensures only relevant details are exposed to the user?",
        options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
        correctIndex: 2,
        explanation: "Abstraction hides complex implementation and exposes only essential features.",
    },
    {
        topic: "OOPs", difficulty: "medium",
        question: "Can a class in Java implement multiple interfaces?",
        options: ["No", "Yes", "Only with abstract classes", "Only in Java 8+"],
        correctIndex: 1,
        explanation: "Java classes can implement multiple interfaces, enabling a form of multiple inheritance.",
    },
    /* ─── OOPs — Hard ─── */
    {
        topic: "OOPs", difficulty: "hard",
        question: "What is the 'Diamond Problem' in OOP?",
        options: ["A memory leak caused by circular references", "An ambiguity when a class inherits from two classes that share a common ancestor", "A runtime error caused by type casting", "A compile error when overloading operators"],
        correctIndex: 1,
        explanation: "If B and C both extend A, and D extends both B and C, D inherits ambiguous paths to A.",
    },
    {
        topic: "OOPs", difficulty: "hard",
        question: "What does the Liskov Substitution Principle (LSP) state?",
        options: ["Each class should have a single responsibility", "Objects of a subclass should be replaceable for objects of the superclass without breaking the program", "A class should depend on abstractions, not implementations", "A class should not depend on classes it does not use"],
        correctIndex: 1,
        explanation: "LSP (the 'L' in SOLID) says subtypes must be behaviorally substitutable for their base types.",
    },
    /* ─── SQL — Easy ─── */
    {
        topic: "SQL", difficulty: "easy",
        question: "Which SQL clause is used to filter rows returned by a query?",
        options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
        correctIndex: 2,
        explanation: "WHERE filters rows before grouping/aggregation; it applies to individual row conditions.",
    },
    {
        topic: "SQL", difficulty: "easy",
        question: "What does SELECT * FROM employees; return?",
        options: ["Only the first row", "All columns and all rows from the employees table", "Only unique rows", "The count of rows"],
        correctIndex: 1,
        explanation: "SELECT * returns all columns, and no WHERE clause means all rows are returned.",
    },
    {
        topic: "SQL", difficulty: "easy",
        question: "Which SQL command is used to add a new row to a table?",
        options: ["UPDATE", "ALTER", "INSERT INTO", "ADD ROW"],
        correctIndex: 2,
        explanation: "INSERT INTO ... VALUES (...) is the standard SQL syntax for adding rows.",
    },
    {
        topic: "SQL", difficulty: "easy",
        question: "What does the PRIMARY KEY constraint ensure?",
        options: ["All values in a column are negative", "Each row has a unique and non-null identifier", "Column values can be duplicated freely", "The column references another table"],
        correctIndex: 1,
        explanation: "A PRIMARY KEY uniquely identifies each row and implicitly enforces NOT NULL + UNIQUE.",
    },
    /* ─── SQL — Medium ─── */
    {
        topic: "SQL", difficulty: "medium",
        question: "What is the difference between WHERE and HAVING in SQL?",
        options: ["WHERE filters columns; HAVING filters rows", "WHERE filters rows before aggregation; HAVING filters after aggregation", "They are interchangeable", "HAVING is faster than WHERE"],
        correctIndex: 1,
        explanation: "WHERE applies before GROUP BY; HAVING applies to grouped/aggregated results.",
    },
    {
        topic: "SQL", difficulty: "medium",
        question: "Which type of JOIN returns only rows that have matching values in both tables?",
        options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
        correctIndex: 2,
        explanation: "INNER JOIN returns only rows where the join condition is met in both tables.",
    },
    {
        topic: "SQL", difficulty: "medium",
        question: "What does the DISTINCT keyword do in SQL?",
        options: ["Sorts the result set", "Removes duplicate rows from the result set", "Joins two tables", "Counts unique values only"],
        correctIndex: 1,
        explanation: "SELECT DISTINCT eliminates duplicate rows from the output.",
    },
    /* ─── SQL — Hard ─── */
    {
        topic: "SQL", difficulty: "hard",
        question: "What is a SQL Correlated Subquery?",
        options: ["A subquery that runs only once for the whole outer query", "A subquery referenced inside a JOIN clause", "A subquery that references a column from the outer query and is executed once per outer row", "A subquery inside the FROM clause"],
        correctIndex: 2,
        explanation: "A correlated subquery is evaluated for each row of the outer query because it references outer columns.",
    },
    {
        topic: "SQL", difficulty: "hard",
        question: "What is the purpose of SQL window functions like ROW_NUMBER(), RANK(), and DENSE_RANK()?",
        options: ["To group rows like GROUP BY", "To perform calculations across a set of rows related to the current row without collapsing them", "To delete duplicate rows", "To create indexes on multiple columns"],
        correctIndex: 1,
        explanation: "Window functions compute values across specified rows (partitions) while keeping each row in the output.",
    },
];

const run = async () => {
    if (!MONGO_URI) {
        console.error("❌ MONGO_URI not found in .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        let seeded = 0;
        for (const q of questions) {
            await ContestQuestion.updateOne(
                { topic: q.topic, question: q.question },
                { $set: q },
                { upsert: true }
            );
            seeded++;
        }

        console.log(`✅ Seeded ${seeded} contest questions successfully.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
};

run();
