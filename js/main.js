// helpers

function getTextNodesIn(elem, opt_fnFilter) {
  var textNodes = [];
  if (elem) {
    for (var nodes = elem.childNodes, i = nodes.length; i--;) {
      var node = nodes[i], nodeType = node.nodeType;
      if (nodeType === 3) {
        if (!opt_fnFilter || opt_fnFilter(node, elem)) {
          textNodes.push(node);
        }
      }
      else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        textNodes = textNodes.concat(getTextNodesIn(node, opt_fnFilter));
      }
    }
  }
  return textNodes;
}

// routing
function changeRoute(e) {
  const isLink = e.target.classList.contains('router-link');

  if (!isLink) {
    return;
  }

  e.preventDefault();

  const outletElement = document.querySelector(e.target.attributes.href.value);

  if (outletElement) {
    [...document.getElementById('router-outlet').children].forEach(el => {
      el.hidden = true;
    })

    outletElement.hidden = false;
  }
}

document.body.addEventListener('click', changeRoute);

// search form
function clearSearchOccurrences() {
  [...document.querySelectorAll('.search-occurrence')].forEach(el => {
    const parent = el.parentNode;
    const newElement = document.createTextNode(el.textContent.replaceAll(/<span class="highlight">(\w+)<\/span>/g, '$1'));
    parent.replaceChild(newElement, el);
  })
}

(function searchFormModule() {
  const form = document.getElementById('search_form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearSearchOccurrences();

    const formData = new FormData(e.currentTarget);

    const searchForText = formData.get('search');

    const textNodes = getTextNodesIn(document.body);

    textNodes.forEach((textNode) => {
      if (textNode.textContent.includes(searchForText)) {
        const parent = textNode.parentNode;
        const newElement = document.createElement('span');
        const searchIndex = textNode.textContent.indexOf(searchForText);
        if (searchIndex !== -1) {
          newElement.classList.add('search-occurrence');
          newElement.innerHTML = textNode.textContent.substring(0, searchIndex) + `<span class="highlight">${searchForText}</span>` + textNode.textContent.substring(searchIndex + searchForText.length);
          parent.replaceChild(newElement, textNode);
        }
      }
    });
  });

  document.getElementById('search_field').addEventListener('search', clearSearchOccurrences);
})()
