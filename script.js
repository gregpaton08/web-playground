const dropZone = document.getElementById('drop-zone');
const schemaElement = document.getElementById('schema');

// Prevent default browser behavior for drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Handle dropped file
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = function () {
        const data = JSON.parse(reader.result);
        const schema = getSchema("root", data);
        schemaElement.innerHTML = `<pre>${JSON.stringify(schema, null, 2)}</pre>`;
      }
      reader.readAsText(file);
    } else {
      alert('Please drop a JSON file.');
    }
  }
}

// // Recursive function to get the schema of an object
// function getSchema(obj) {
//   const schema = {};

//   for (const key in obj) {
//     const value = obj[key];
//     const valueType = typeof value;

//     if (valueType === 'object' && !Array.isArray(value) && value !== null) {
//       schema[key] = getSchema(value);
//     } else {
//       schema[key] = valueType;
//     }
//   }

//   return schema;
// }

// function getSchema(obj, parentKey = '') {
//   const schema = {};

//   for (const key in obj) {
//       const value = obj[key];
//       const valueType = typeof value;
//       const fullKey = parentKey ? `${parentKey}.${key}` : key;

//       if (valueType === 'object' && !Array.isArray(value) && value !== null) {
//           schema[`<a href="#" class="key" data-key="${fullKey}">${key}</a>`] = getSchema(value, fullKey);
//       } else {
//           schema[`<a href="#" class="key" data-key="${fullKey}">${key}</a>`] = valueType;
//       }
//   }

//   return schema;
// }

function getSchema(id, obj) {
  if (typeof id !== 'string') {
    throw new Error('id must be a string');
  }

  if (Array.isArray(obj)) {
    // NOTE: assumes arrays are of uniform type.
    var  retObj = getSchema(id, obj[0]);
    delete retObj.title;
    return {
      'title': id,
      'type': 'array',
      'items': retObj
    };
  } else if (typeof obj === 'object') {
    var retObj = {
      'title': id,
      'type': 'object'
    };
    retObj.properties = {};
    for (var prop in obj) {
      console.log("prop = " + prop);
      // TODO: make all props clickable, display list of all possible values.
      var propDisplayKey = `<a href="#" class="key">${prop}</a>`;
      if (obj.hasOwnProperty(prop)) {
        retObj.properties[propDisplayKey] = getSchema(prop, obj[prop]);
        delete retObj.properties[propDisplayKey].title;
      }
    }

    return retObj;
  } else {
    return {
      'title': id,
      'type': typeof obj
    };
  }
}