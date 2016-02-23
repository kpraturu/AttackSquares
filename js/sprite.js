
(function() {
    function Sprite(url, pos, initLoc) {
        this.pos = pos;
        this.url = url;
        this.initLoc = initLoc;
    };

    Sprite.prototype = {
        render: function(ctx) {

            var x = this.pos[0];
            var y = this.pos[1];


            ctx.drawImage(resources.get(this.url), x, y);
        }
    };

    window.Sprite = Sprite;
})();