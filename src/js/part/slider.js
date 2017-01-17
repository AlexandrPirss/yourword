var swiper = new Swiper('.swiper-container', {
	nextButton: '.swiper-button-next',
	prevButton: '.swiper-button-prev',
	paginationClickable: true,
	slidesPerView: 3,
	spaceBetween: 14,
	breakpoints: {
		1024: {
			slidesPerView: 2,
			spaceBetween: 0
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 0
		},
		640: {
			slidesPerView: 1,
			spaceBetween: 0
		},
		320: {
			slidesPerView: 1,
			spaceBetween: 0
		}
	}
});