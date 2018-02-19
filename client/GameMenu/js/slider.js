$(function() {
			var inWrap = $(".inner-wrapper");
			$(".prev").on("click", function() {
				inWrap.animate({ left: "0%" }, 300, function() {
					inWrap.css("left", "-100%");
					$(".slide").first().before($(".slide").last());
				});
			});

			$(".next").on("click", function() {
				inWrap.animate({ left: "-200%" }, 300, function() {
					inWrap.css("left", "-100%");
					$(".slide").last().after($(".slide").first());
				});
			});
			
			$(".slide-img").on("click", function() {
				window.location.href = this.id + '.html';
			});
		});
