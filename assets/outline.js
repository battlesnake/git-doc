(function () {
	'use strict';

	var anchor_id = 0;

	var headers = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
	var headerIdx = 0;

	var nav = document.querySelector('nav');
	nav.appendChild($('h1', document.title));
	nav.appendChild($('h2', 'Contents'));

	generate_toc(1, nav);

	var xrefs = document.querySelectorAll('a[href^="#"]');

	for (var i = 0; i < xrefs.length; i++) {
		var xref = xrefs[i];
		var hash = xref.getAttribute('href').substr(1);
		var target = document.querySelector('a[name="' + hash + '"]');
		(function (xref, target, hash) {
			xref.addEventListener('click', function () {
				flashElement(xref);
				flashElement(target);
				location.hash = '#' + hash.replace(/^toc-/, '');
			});
		}(xref, target, hash));
	}

	function flashElement(element) {
		element.classList.remove('fadeout');
		element.classList.add('active');
		setTimeout(function () {
			element.classList.add('fadeout');
			element.classList.remove('active');
		}, 50);
	}

	function generate_toc(level, parent) {
		var lastItem = null;
		var ul = $('ol');
		parent.appendChild(ul);
		while (headerIdx < headers.length) {
			var hdr = headers[headerIdx];
			var hdrLevel = Number(hdr.tagName.charAt(1));
			var id = 'h' + hdrLevel + '-' + anchor_id++;
			var text = hdr.textContent;
			hdr.textContent = '';
			hdr.appendChild($('a', text, { name: id, href: '#toc-' + id }));
			if (hdrLevel === level) {
				lastItem = $('li');
				lastItem.appendChild($('a', text, { name: 'toc-' + id, href: '#' + id }));
				ul.appendChild(lastItem);
				headerIdx++;
			} else if (hdrLevel === level + 1) {
				generate_toc(level + 1, lastItem);
			} else {
				return;
			}
		}
	}

	function $(tag, text, attrs) {
		var el = document.createElement(tag);
		if (typeof text === 'string') {
			el.textContent = text;
		}
		if (attrs) {
			for (var prop in attrs) {
				el.setAttribute(prop, attrs[prop]);
			}
		}
		return el;
	}

})();
