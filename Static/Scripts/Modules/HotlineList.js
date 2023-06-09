/* This page gets the data form the end point and uses that data
to render the hotline list dynamically. The renderHotlineListPage 
function is being exported as a module so that the site.js can use
this function to render. */
import { getHotlineData } from '../Modules/CrisisConnectorEndpoints.js';
import { createElementAndAppend } from '../Modules/Helper.js';

const renderHotlineListPage = async ()  => {
	const displayHotlines = data => {
		if (!data) return;
		/* This code takes the .json file and starts to deserialize the file.
		It is going thought the json file and appropriately append to the DOM. */
		data.forEach(({ title, types }) => {
			const hotlineList = createElementAndAppend(document.body, "div", "hotlineList", null, ["searchHotline"]);
			const hotlineTitle = createElementAndAppend(hotlineList, "div", "hotlineTitle");
			createElementAndAppend(hotlineTitle, "h2", null, title);
			const hotlineName = createElementAndAppend(hotlineTitle, "div", "hotlineName");
			types.forEach(({ name, phone }) => {
			  const hotlineLink = createElementAndAppend(hotlineName, "a", null, name);
			  hotlineLink.href = `tel:${types[0].phone}`;
			});
			hotlineName.addEventListener("click", (event) => {
				// Prevent default behavior of following the anchor link
				event.preventDefault();
				// Ask user if they want to make a call
				// const confirmed = window.confirm(`Do you want to call ${title}?`);
				const confirmed = window.confirm(`Do you want to call?`);
				if (confirmed) {
				  // Open the phone app with the phone number
				  window.location.href = `tel:${types[0].phone}`;
				}
			  });
			});
	}	

	/* On the phone, it the users have the tency to press return while typing.
	Added the code that when they do press enter it igrones it and 
	shows the result based on time  */
	let searchTimeout = null;
	const searchInput = document.querySelector('#search');
	searchInput.addEventListener('keydown', function(event) {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	});
	/* The code below handles the search. The search will run every 200ms for performace reasons.
	The code gets the user input, and then it lowercases it. Afterwards it get's the text from certain elements
	then lowcases those text, and then checks if any of thoses matches. 

	-- How the serach is displaying it
	At the start, it will set all display to none, if it finds the match it will set 
	parnet to display, we are getting the parnet with the code element.closest
	*/
	searchInput.addEventListener('keyup', ({ key, target }) => {
		const runSearch = () => {
		  const searchText = target.value.toLowerCase().trim();
		  const hasText = searchText !== '';
	  
		  document.querySelectorAll('.searchHotline').forEach(element => {
			element.style.display = hasText ? 'none' : 'block';
		  });
	  
		  if (!hasText) return;
	  
		  const elements = document.querySelectorAll('.searchHotline *');
		  elements.forEach(element => {
			const text = element.innerText.toLowerCase();
			const found = text.indexOf(searchText) > -1;	  
			if (!found) return;
			if(element.tagName.toLocaleLowerCase() === 'a') {
				element.classList.add('highlight');
			}
			console.log(element);
			const parent = element.closest('.searchHotline');
			parent.style.display = 'block';
			setTimeout(() => {
			  element.classList.remove('highlight');
			}, 3000); // Remove 'highlight' class after 2 seconds (adjust as needed)
		  });
		};
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(runSearch, 100);
	  });
	/* Since getHotline is an aync function, we need to do await to call it. 
	The only way to do await is when the function is inside a async, that's why
	it is nested async arrow function. The method getHotlineData is being imported
	from a module */

	displayHotlines(await getHotlineData('hotline')); // Calling the method from the Endpoint Module
};

export { renderHotlineListPage };
