var Mesh = require('qtek/lib/Mesh');
var BoundingBox = require('qtek/lib/math/BoundingBox');
var StaticGeometry = require('qtek/lib/StaticGeometry');
var Material = require('qtek/lib/Material');
var Shader = require('qtek/lib/Shader');

var BOX_POINTS = [
    [-1, 1, 1], [1, 1, 1],
    [1, 1, 1], [1, -1, 1],
    [1, -1, 1], [-1, -1, 1],
    [-1, -1, 1], [-1, 1, 1],

    [-1, 1, -1], [1, 1, -1],
    [1, 1, -1], [1, -1, -1],
    [1, -1, -1], [-1, -1, -1],
    [-1, -1, -1], [-1, 1, -1],

    [-1, 1, 1], [-1, 1, -1],
    [1, 1, 1], [1, 1, -1],
    [-1, -1, 1], [-1, -1, -1],
    [1, -1, 1], [1, -1, -1]
];

var BoundingGzimo = Mesh.extend(function () {

    return {
        target: null,

        mode: Mesh.LINES,

        lineWidth: 3,

        ignorePicking: true,

        _boundingBox: new BoundingBox()
    };
}, function () {
    if (!this.geometry) {
        var geometry = this.geometry = new StaticGeometry();
        var attributes = geometry.attributes;

        attributes.position.init(24);
        for (var i = 0; i < BOX_POINTS.length; i++) {
            attributes.position.set(i, BOX_POINTS[i]);
        }
    }
    if (!this.material) {
        this.material = new Material({
            shader: new Shader({
                vertex: Shader.source('qtek.basic.vertex'),
                fragment: Shader.source('qtek.basic.fragment')
            })
        });
    }
}, {
    updateLocalTransform: function (force) {
        var bbox = this._boundingBox;
        if (this.target) {
            this.target.getBoundingBox(null, bbox);
            bbox.applyTransform(this.target.worldTransform);

            this.position.copy(bbox.max).add(bbox.min).scale(0.5);
            this.scale.copy(bbox.max).sub(bbox.min).scale(0.5);
        }

        Mesh.prototype.updateLocalTransform.call(this, force);
    }
});

module.exports = BoundingGzimo;