var getItemOffset = function getItemOffset(item) {
    return item.offsetTop;
  };
  
  var moveMarker = function moveMarker(offset) {
    var marker = document.querySelector('.active-marker');
    marker.style.transform = 'translateY(' + offset + 'px)';
  
  };
  
  var toggleActive = function toggleActive(e) {
    e.preventDefault();
  
    // Remove any existing active classes
    var links = document.querySelectorAll('.vertical-menu-item');
    links.forEach(function (link) {return link.classList.remove('is-active');});
  
    // Add class to active link
    var activeItem = e.target.parentElement;
    activeItem.classList.toggle('is-active');
    var offset = getItemOffset(activeItem);
    moveMarker(offset);
  };
  
  // Attach click event listener
  var menu = document.querySelector('.vertical-menu');
  
  menu.addEventListener('click', toggleActive);

  'use strict';

var switchButton 			= document.querySelector('.switch-button');
var switchBtnRight 			= document.querySelector('.switch-button-case.right');
var switchBtnLeft 			= document.querySelector('.switch-button-case.left');
var activeSwitch 			= document.querySelector('.active');

function switchLeft(){
	switchBtnRight.classList.remove('active-case');
	switchBtnLeft.classList.add('active-case');
	activeSwitch.style.left 						= '0%';
}

function switchRight(){
	switchBtnRight.classList.add('active-case');
	switchBtnLeft.classList.remove('active-case');
	activeSwitch.style.left 						= '50%';
}

switchBtnLeft.addEventListener('click', function(){
	switchLeft();
}, false);

switchBtnRight.addEventListener('click', function(){
	switchRight();
}, false);

