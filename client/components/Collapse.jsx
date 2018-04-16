import React from 'react'
import $ from 'jquery'

export function Collapse (context) {
//javascript:
    /*if (!window.jQuery) {
        var s = document.createElement('script');
        s.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js';
        document.body.appendChild(s);
    }*/
    if (context.started) {
        // Has started, can't twice
        return;
    }

    var maxTime = 50;

    var ticker = setInterval(function() { tick() }, 5);
    var allItems = $(".rbc-event").not(".rbc-event-allday");
    var time = 0;
    var itemData = [];
    context.started = true;

    function tick() {
        time++;
        //console.log(time);
        if (time >= maxTime)  {
            clearInterval(ticker);
            reset();
            return;
        }
        allItems.each(function (index) {
            var top = parseFloat($(this).css('top'));
            var left = parseFloat($(this).css('left'));
            if (time == 1) {
                // populate the item data
                var newItem = new function() {
                    this.originalTop = top;
                    this.originalLeft = left;
                    this.velocityX = (Math.random() * 10) - 5;
                    this.velocityY = -1 * Math.abs(Math.random() * 20);
                    this.rotationVel = (Math.random() * 15) - 7.5;
                    this.rotation = 0;
                    this.rotationDrag = 1.01;
                };
                itemData.push(newItem);
            }
            itemData[index].velocityY += 1.2;
            itemData[index].rotationVel /= itemData[index].rotationDrag;
            itemData[index].rotation += itemData[index].rotationVel;
            //console.log( index + ": " + $( this ).text() );

            var deg = itemData[index].rotation;

            $(this).css('top', top + itemData[index].velocityY);
            $(this).css('left', left + itemData[index].velocityX);
            $(this).css({'transform' : 'rotate('+deg+'deg)'});
        });


    };

    function reset() {
        allItems.each(function (index) {
            $(this).css('top', itemData[index].originalTop);
            $(this).css('left', itemData[index].originalLeft);
            $(this).css({'transform' : 'rotate('+ 0 +'deg)'});
        });
        context.started = false;
    }
}