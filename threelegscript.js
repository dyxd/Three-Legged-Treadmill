// created by: Diana Yeung
// Mar 19, 2014
// version: 1.1
// 		- added animation support but current set to 0 because I don't like it
//		- only saves high score if accuracy is above 95% to prevent spamming
// 		- accuracy turns red if it is below 95%

$(document).ready(function() {
    var current = 0; // current index of block
    var score = 0;
    var error = 0;
    var gameActive = false;
    var highscore = 0;
    var accuracy = Math.round(100*(score/(score+error)));
    
    // sets previous highscore
    if (readCookie('highscore') != null) {
	    $('.highscore span').html(readCookie('highscore'));
	    highscore = readCookie('highscore');
	}
    
    // starts the game
    $('.start').click(function() {
        reset();
    });
    
    // restarts the game
    $('.board').delegate('.retry', 'click', function() {
        reset();
    });
    
    // adds a row of blocks, one real and two fake
    function addRow(start) {
        // picks a random column to generate new block
        var randCol = Math.floor(Math.random() * 3) + 1;
        var animationSpeed = 0;
        var block = '<div class="block row'+current+'">'+randCol+'</div>';
        
        if (start) {
            $('.block').animate({top: '+=50.147px'}, 0);
        } else {
            $('.block').animate({top: '+=50.147px'}, animationSpeed);
        }
        
        // adds row of real and flake blocks to the columns
        $('.col'+randCol).prepend(block);
        
        // sets and cycles through the index of the blocks
        if (current == 8) {
            current = 0;
        } else {
            current++;
        }
    }
    
    // removes the lowest row
    function removeRow() {
        $('.row'+current).remove();
    }
    
    // moves the blocks one step down
    function step() {
        removeRow();
        addRow(false);
        score++;
        $('.score span').html(score);
    }
    
    // starts the game with a clean slate
    function startGame() {
        gameActive = true;
        $('.accuracy span').css({color: '#063940'});
        
        var time = 30; // number of seconds to run the game
        
        // fills the board at start
        for (var i = 0; i < 9; i++) {
            addRow(true);
        }
        
        // timer that counts down by 1 second; ends game time runs out
        if (gameActive) {
            var timer = setInterval(function() {
                $('.time span').html(time);
                if (time > 0) {
                    time--;
                } else {
                    clearInterval(timer);
                    endGame();
                }
            }, 1000);
        }
    }
    
    // ends the game and displays game over message and try again option
    function endGame() {
        gameActive = false;
        $('.board').append('<div class="gameover">Game Over<div class="retry">Try Again</div></div>');
        if (accuracy < 95) {
            $('.accuracy span').css({color: 'rgb(255, 78, 85)'});
        } else if (score > highscore) {
            highscore = score;
            $('.highscore span').html(highscore);
            createCookie('highscore', highscore, 365);
        }
    }
    
    function reset() {
        current = 0;
        score = 0;
        error = 0;
        $('.col').empty(); // clears all old blocks
        $('.score span').html(score);
        $('.accuracy span').html('100%');
        $('.start').remove();
        $('.gameover').remove();
        startGame();
    }
    
    // take keyboard inputs
    $(document).keydown(function(key) {
        var currentBlock = $('.block.row'+current).html();
        var key1 = 86; // v
        var key2 = 66; // b
        var key3 = 78; // n
        
        if ((key.keyCode == key1 || key.keyCode == key2 || key.keyCode == key3) && gameActive) {
            // step when entered key is correct
            if (key.keyCode == key1 && currentBlock == 1) {
                step();
            } else if (key.keyCode == key2 && currentBlock == 2) {
                step();
            } else if (key.keyCode == key3 && currentBlock == 3) {
                step();
            } else {
                error++;
            }
            accuracy = Math.round(100*(score/(score+error)));
            $('.accuracy span').html(accuracy+'%');
        }
        
        // resets the game when "enter" key is pressed
        if (!gameActive && key.keyCode == 13) {
            reset();
        }
    });
    
    // makes a cookie to save the high score
    function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
});