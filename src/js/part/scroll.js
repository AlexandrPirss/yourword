$(document).ready(function() {
	$('a[href^="#"]').click(function(){ // <a href="index.html#gallery">Получаться html перекрыл #</a>
		var el = $(this).attr('href');
		$('body').animate({
			scrollTop: $(el).offset().top}, 1000);
		return false;
	});
});