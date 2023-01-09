/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    const results = [];
    let preHyphenWord = '';
    let preHyphenLineAdded = false;
    let prevPage = -1;
    let prevLine = -1;

    for (let i = 0; i < scannedTextObj.length; i++) {
        const book = scannedTextObj[i];
        for (let j = 0; j < book.Content.length; j++) {
            const bookContent = book.Content[j];
            let alreadyAdded = false;

            // handle hyphenated words

            // if previous line ended with a hyphen and it is the next line of the same page:
            if(preHyphenWord != '' && bookContent.Page === prevPage && bookContent.Line === (prevLine + 1)) {
                const postHyphenWord = bookContent.Text.split(' ')[0]; // get first word
                const remainingText = bookContent.Text.substring(bookContent.Text.indexOf(' ')+1);
                bookContent.Text = remainingText; // check the rest of the string after
                // if the hyphenated word is the target, add previous and current line to results
                if(preHyphenWord + postHyphenWord === searchTerm) {
                    if(!preHyphenLineAdded) {
                        // add previous ISBN, Page, and Line to the results array
                        results.push({
                            // interpret ISBN as string
                            ISBN: book.ISBN.toString(),
                            Page: prevPage,
                            Line: prevLine
                        });
                    }
                    alreadyAdded = true;
                    // add current ISBN, Page, and Line to the results array
                    results.push({
                        // interpret ISBN as a string
                        ISBN: book.ISBN.toString(),
                        Page: bookContent.Page,
                        Line: bookContent.Line
                    });
                }
            }

            // reset previous values
            preHyphenWord = '';
            preHyphenLineAdded = false;
            prevPage = -1;
            prevLine = -1;

            // if this line ends with a hyphen:
            if(bookContent.Text.endsWith('-')) {
                preHyphenWord = bookContent.Text.split(' ').pop().slice(0, -1); // pop to get last word, then slice to remove trailing hyphen
                prevPage = bookContent.Page;
                prevLine = bookContent.Line;
                if(alreadyAdded) {
                    preHyphenLineAdded = true;
                }
            }

            if(alreadyAdded) {
                continue; // skip further checking if this line is already added
            }
            // check if the Text contains the desired searchTerm
            if (bookContent.Text.includes(' ' + searchTerm + ' ') || bookContent.Text.split(' ')[0] === searchTerm || bookContent.Text.split(' ').pop() === searchTerm) {
                // if so, add ISBN, Page, and Line to the results array
                results.push({
                    // interpret ISBN as a string
                    ISBN: book.ISBN.toString(),
                    Page: bookContent.Page,
                    Line: bookContent.Line
                });
                // if there is a trailing hyphen, mark this line as already added in case it would be added again
                if(preHyphenWord != '') {
                    preHyphenLineAdded = true;
                }
            }
        }
    }

    // put the SearchTerm and Results array together in the requested format to return
    return {
        SearchTerm: searchTerm,
        Results: results
    };
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]

const testInputA = [
    {
        "Title": "Test Input A",
        "ISBN": "00001",
        "Content": [
            {
                "Page": 1,
                "Line": 19,
                "Text": "Sample text number one featu-"
            },
            {
                "Page": 1,
                "Line": 20,
                "Text": "ring some extra things including featuri-"
            },
            {
                "Page": 1,
                "Line": 21,
                "Text": "ng the word featuring several times but not feat-"
            },
            {
                "Page": 1,
                "Line": 30,
                "Text": "uring sample apples, oranges, and bananas\' flavors."
            }
        ]
    }
]

const testInputB = [
    {
        "Title": "Test Input B",
        "ISBN": "00002",
        "Content": [
            {
                "Page": 34,
                "Line": 5,
                "Text": "A rather unusual page with a ra-"
            },
            {
                "Page": 34,
                "Line": 6,
                "Text": "ther unusual-"
            },
            {
                "Page": 34,
                "Line": 7,
                "Text": "unusual nonexistent word here and short middle, but otherwise fairly normal."
            },
            {
                "Page": 34,
                "Line": 18,
                "Text": "The quick brown fox jumped over the slow brown fox which"
            },
            {
                "Page": 34,
                "Line": 19,
                "Text": "rolled over the sleeping brown fox."
            }
        ]
    }
]
    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

const testOutputA1 = {
    "SearchTerm": "featuring",
    "Results": [
        {
            "ISBN": "00001",
            "Page": 1,
            "Line": 19
        },
        {
            "ISBN": "00001",
            "Page": 1,
            "Line": 20
        },
        {
            "ISBN": "00001",
            "Page": 1,
            "Line": 21
        }
    ]
}

const testOutputA2 = {
    "SearchTerm": "ring",
    "Results": []
}

const testOutputA3 = {
    "SearchTerm": "sample",
    "Results": [
        {
            "ISBN": "00001",
            "Page": 1,
            "Line": 30
        }
    ]
}

const testOutputB1 = {
    "SearchTerm": "unusual",
    "Results": [
        {
            "ISBN": "00002",
            "Page": 34,
            "Line": 5
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

const testA1result = findSearchTermInBooks("featuring", testInputA);
if(JSON.stringify(testOutputA1) === JSON.stringify(testA1result)) {
    console.log("PASS: Test A1");
} else {
    console.log("FAIL: Test A1");
    console.log("Expected:", testOutputA1);
    console.log("Received:", testA1result);
}

const testA2result = findSearchTermInBooks("ring", testInputA);
if(JSON.stringify(testOutputA2) === JSON.stringify(testA2result)) {
    console.log("PASS: Test A2");
} else {
    console.log("FAIL: Test A2");
    console.log("Expected:", testOutputA2);
    console.log("Received:", testA2result);
}

const testA3result = findSearchTermInBooks("sample", testInputA);
if(JSON.stringify(testOutputA3) === JSON.stringify(testA3result)) {
    console.log("PASS: Test A3");
} else {
    console.log("FAIL: Test A3");
    console.log("Expected:", testOutputA3);
    console.log("Received:", testA3result);
}

const testB1result = findSearchTermInBooks("unusual", testInputB);
if(JSON.stringify(testOutputB1) === JSON.stringify(testB1result)) {
    console.log("PASS: Test B1");
} else {
    console.log("FAIL: Test B1");
    console.log("Expected:", testOutputB1);
    console.log("Received:", testB1result);
}
