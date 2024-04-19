```javascript
// Recursive function to get the schema of an object
function getSchema(obj, parentKey = '') {
    const schema = {};

    for (const key in obj) {
        const value = obj[key];
        const valueType = typeof value;
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (valueType === 'object' && !Array.isArray(value) && value !== null) {
            schema[`<a href="#" class="key" data-key="${fullKey}">${key}</a>`] = getSchema(value, fullKey);
        } else {
            schema[`<a href="#" class="key" data-key="${fullKey}">${key}</a>`] = valueType;
        }
    }

    return schema;
}

// Event listener for key clicks
const schemaElement = document.getElementById('schema');
schemaElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
        const key = e.target.dataset.key;
        handleKeyClick(key);
    }
});

// Function to handle key click
function handleKeyClick(key) {
    console.log(`Key clicked: ${key}`);
    // Add your custom logic here
}
```
