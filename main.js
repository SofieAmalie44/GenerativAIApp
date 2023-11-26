console.log("hello");

const HUGGINGFACE_TOKEN = "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";

async function getGeneratedText(query) {
    // We can call this function 8 times before we respond
    let counter = 0;
    let prevGeneratedText = "";
    let generatedText = await fetchText(query);
    while (generatedText !== prevGeneratedText && counter < 8) {
        prevGeneratedText = generatedText;
        generatedText = await fetchText(generatedText);
        console.log(generatedText)
        counter++;
    }
    console.log(generatedText)
    console.log(query)
    console.log(generatedText)
    return generatedText.replace(query, "");
}

function fetchText(query) {
    return fetch(
        "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
        {
            headers: {
                Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({"inputs": query}),
        }
    )
        .then(response => response.json())
        .then(data => {
            return data[0].generated_text;
        })
}

const button = document.querySelector('button');
const input = document.querySelector('input');
const generatedStory = document.querySelector('.generated-story')
button.addEventListener("click", () => {
    getGeneratedText(`Please generate a fun and creative fact about the following celebrity/politician: ${input.value}. 
    It does not have to be true, just for fun and entertaining. 
    The fact could be about: dating someone random, someone else's career changes, 
    being untruthful, changing name, plastic surgery, passing crazy laws, being embarrassing in public and so on.`)
        .then(generatedText => {
            generatedStory.innerHTML = generatedText
            generatedStory.style.fontSize = '30px';
            console.log(generatedText)
        });
});

