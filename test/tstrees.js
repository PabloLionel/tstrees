"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tt;
(function (Tt) {
    var OrdenRecorrido;
    (function (OrdenRecorrido) {
        OrdenRecorrido[OrdenRecorrido["PREORDER"] = 0] = "PREORDER";
        OrdenRecorrido[OrdenRecorrido["INORDER"] = 1] = "INORDER";
        OrdenRecorrido[OrdenRecorrido["POSTORDER"] = 2] = "POSTORDER";
    })(OrdenRecorrido = Tt.OrdenRecorrido || (Tt.OrdenRecorrido = {}));
    var TreeBinaryAbstract = (function () {
        function TreeBinaryAbstract(compare) {
            this._cmp = function (val) { return val; };
            if (typeof compare === 'function')
                this._cmp = compare;
        }
        Object.defineProperty(TreeBinaryAbstract.prototype, "cmp", {
            get: function () {
                return this._cmp;
            },
            set: function (v) {
                this._cmp = v;
            },
            enumerable: true,
            configurable: true
        });
        TreeBinaryAbstract.prototype._find = function (v, p) {
            if (!p)
                return null;
            var v_cmp = this.cmp(p.value);
            if (v == v_cmp)
                return p;
            else if (v < v_cmp)
                return this._find(v, p.left);
            else
                return this._find(v, p.right);
        };
        TreeBinaryAbstract.prototype.find = function (v) {
            return this._find(v, this.root);
        };
        TreeBinaryAbstract.prototype._contains = function (v, n) {
            if (!n)
                return false;
            var v_cmp = this.cmp(n.value);
            if (v < v_cmp)
                return this._contains(v, n.left);
            else if (v > v_cmp)
                return this._contains(v, n.right);
            else
                return true;
        };
        TreeBinaryAbstract.prototype.contains = function (v) {
            return this._contains(v, this.root);
        };
        TreeBinaryAbstract.prototype.traverse = function (process, order) {
            if (order === void 0) { order = OrdenRecorrido.INORDER; }
            switch (order) {
                case OrdenRecorrido.PREORDER:
                    this.preOrder(process, this.root);
                    break;
                case OrdenRecorrido.INORDER:
                    this.inOrder(process, this.root);
                    break;
                case OrdenRecorrido.POSTORDER:
                    this.postOrder(process, this.root);
            }
        };
        TreeBinaryAbstract.prototype.preOrder = function (process, n) {
            if (!n)
                return;
            process.call(this, n);
            this.preOrder(process, n.left);
            this.preOrder(process, n.right);
        };
        TreeBinaryAbstract.prototype.inOrder = function (process, n) {
            if (!n)
                return;
            this.inOrder(process, n.left);
            process.call(this, n);
            this.inOrder(process, n.right);
        };
        TreeBinaryAbstract.prototype.postOrder = function (process, n) {
            if (!n)
                return;
            this.postOrder(process, n.left);
            this.postOrder(process, n.right);
            process.call(this, n);
        };
        TreeBinaryAbstract.prototype.toArray = function () {
            var res = [];
            this.traverse(function (n) {
                res.push(n.value);
            });
            return res;
        };
        TreeBinaryAbstract.prototype.toJson = function () {
            var helper = function (node) {
                var res = {};
                if (!node)
                    return null;
                res['left'] = helper(node.left);
                res['value'] = node.value;
                res['right'] = helper(node.right);
                return res;
            };
            return JSON.stringify(helper(this.root), null, 2);
        };
        TreeBinaryAbstract.prototype.min = function (node) {
            var temp;
            if (node)
                temp = node;
            else
                temp = this.root;
            if (temp)
                while (temp.left)
                    temp = temp.left;
            return temp;
        };
        TreeBinaryAbstract.prototype.max = function (node) {
            var tmp;
            if (node)
                tmp = node;
            else
                tmp = this.root;
            if (tmp)
                while (tmp.right)
                    tmp = tmp.right;
            return tmp;
        };
        TreeBinaryAbstract.prototype.isEmpty = function () {
            return !this.root;
        };
        return TreeBinaryAbstract;
    }());
    var Node = (function () {
        function Node(_value, _left, _right) {
            if (_left === void 0) { _left = null; }
            if (_right === void 0) { _right = null; }
            this._value = _value;
            this._left = _left;
            this._right = _right;
        }
        Object.defineProperty(Node.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (n) {
                this._left = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "right", {
            get: function () {
                return this._right;
            },
            set: function (n) {
                this._right = n;
            },
            enumerable: true,
            configurable: true
        });
        return Node;
    }());
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree(compare) {
            var _this = _super.call(this, compare) || this;
            _this._root = null;
            _this._size = 0;
            return _this;
        }
        Object.defineProperty(Tree.prototype, "root", {
            get: function () {
                return this._root;
            },
            set: function (n) {
                this._root = n;
            },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.size = function () {
            return this._size;
        };
        Tree.prototype.insert = function (n, p) {
            if (!p)
                return n;
            var v_cmp_n = this.cmp(n.value);
            var v_cmp_p = this.cmp(p.value);
            if (v_cmp_n < v_cmp_p)
                p.left = this.insert(n, p.left);
            else if (v_cmp_n > v_cmp_p)
                p.right = this.insert(n, p.right);
            else
                this._size--;
            return p;
        };
        Tree.prototype.add = function (v) {
            this.root = this.insert(new Node(v), this.root);
            this._size++;
            return this;
        };
        Tree.prototype.remove = function (v, c, v_tmp) {
            if (!c)
                return null;
            var c_cmp = this.cmp(c.value);
            if (v < c_cmp)
                c.left = this.remove(v, c.left, v_tmp);
            else if (v > c_cmp)
                c.right = this.remove(v, c.right, v_tmp);
            else {
                if (v === v_tmp)
                    this._size--;
                if (!c.left && !c.right)
                    c = null;
                else if (!c.left)
                    c = c.right;
                else if (!c.right)
                    c = c.left;
                else {
                    var tmp = this.min(c.right);
                    c.value = tmp.value;
                    c.right = this.remove(tmp.value, c.right, v_tmp);
                }
            }
            return c;
        };
        Tree.prototype.del = function (v) {
            this.root = this.remove(v, this.root, v);
            return this;
        };
        Tree.prototype.pop = function (v) {
            throw new Error("Method not implemented.");
        };
        return Tree;
    }(TreeBinaryAbstract));
    Tt.Tree = Tree;
    var NodeAVL = (function () {
        function NodeAVL(_value, _left, _right, _height) {
            if (_left === void 0) { _left = null; }
            if (_right === void 0) { _right = null; }
            if (_height === void 0) { _height = 0; }
            this._value = _value;
            this._left = _left;
            this._right = _right;
            this._height = _height;
        }
        Object.defineProperty(NodeAVL.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeAVL.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (n) {
                this._left = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeAVL.prototype, "right", {
            get: function () {
                return this._right;
            },
            set: function (n) {
                this._right = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeAVL.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (h) {
                this._height = h;
            },
            enumerable: true,
            configurable: true
        });
        return NodeAVL;
    }());
    var TreeAVL = (function (_super) {
        __extends(TreeAVL, _super);
        function TreeAVL(compare) {
            var _this = _super.call(this, compare) || this;
            _this._root = null;
            return _this;
        }
        Object.defineProperty(TreeAVL.prototype, "root", {
            get: function () {
                return this._root;
            },
            set: function (root) {
                this._root = root;
            },
            enumerable: true,
            configurable: true
        });
        TreeAVL.prototype.getHeight = function (node) {
            return node ? node.height : -1;
        };
        TreeAVL.prototype.rotationLeft = function (n) {
            var tmp = n.left;
            n.left = tmp.right;
            tmp.right = n;
            n.height = 1 + Math.max(this.getHeight(n.left), this.getHeight(n.right));
            tmp.height = 1 + Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right));
            return tmp;
        };
        TreeAVL.prototype.rotationRight = function (n) {
            var tmp = n.right;
            n.right = tmp.left;
            tmp.left = n;
            n.height = 1 + Math.max(this.getHeight(n.left), this.getHeight(n.right));
            tmp.height = 1 + Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right));
            return tmp;
        };
        TreeAVL.prototype.doubleRotationLeft = function (n) {
            n.left = this.rotationRight(n.left);
            var tmp = this.rotationLeft(n);
            return tmp;
        };
        TreeAVL.prototype.doubleRotationRight = function (n) {
            n.right = this.rotationLeft(n.right);
            var tmp = this.rotationRight(n);
            return tmp;
        };
        TreeAVL.prototype.insert = function (n, c) {
            var newParent = c, n_cmp = this.cmp(n.value), c_cmp = this.cmp(c.value);
            if (n_cmp < c_cmp)
                if (!c.left)
                    c.left = n;
                else {
                    newParent.left = this.insert(n, c.left);
                    if (this.getHeight(c.left) - this.getHeight(c.right) == 2)
                        if (n_cmp < this.cmp(c.left.value))
                            newParent = this.rotationLeft(c);
                        else {
                            newParent = this.doubleRotationLeft(c);
                        }
                }
            else if (n_cmp > c_cmp)
                if (!c.right)
                    c.right = n;
                else {
                    newParent.right = this.insert(n, c.right);
                    if (this.getHeight(c.right) - this.getHeight(c.left) == 2)
                        if (n_cmp > this.cmp(c.right.value))
                            newParent = this.rotationRight(c);
                        else
                            newParent = this.doubleRotationRight(c);
                }
            if (!c.left && c.right)
                c.height = 1 + this.getHeight(c.right);
            else if (!c.right && c.left)
                c.height = 1 + this.getHeight(c.left);
            else
                c.height = 1 + Math.max(this.getHeight(c.left), this.getHeight(c.right));
            return newParent;
        };
        TreeAVL.prototype.add = function (v) {
            if (this.root)
                this.root = this.insert(new NodeAVL(v), this.root);
            else
                this.root = new NodeAVL(v);
            return this;
        };
        TreeAVL.prototype._remove = function (n, v) {
            if (!n)
                return n;
            var n_cmp = this.cmp(n.value);
            if (v < n_cmp)
                n.left = this._remove(n.left, v);
            else if (v > n_cmp)
                n.right = this._remove(n.right, v);
            else {
                var temp = void 0;
                if (!n.left) {
                    temp = n.right;
                    n = null;
                    return temp;
                }
                else if (!n.right) {
                    temp = n.left;
                    n = null;
                    return temp;
                }
                temp = _super.prototype.min.call(this, n.right);
                n.value = temp.value;
                n.right = this._remove(n.right, temp.value);
            }
            if (!n)
                return n;
            n.height = 1 + Math.max(this.getHeight(n.left), this.getHeight(n.right));
            var balance = this.getBalanceFactor(n);
            if (balance > 1 && this.getBalanceFactor(n.left) >= 0)
                return this.rotationLeft(n);
            if (balance < -1 && this.getBalanceFactor(n.right) <= 0)
                return this.rotationRight(n);
            if (balance > 1 && this.getBalanceFactor(n.left) < 0)
                return this.doubleRotationLeft(n);
            if (balance < -1 && this.getBalanceFactor(n.right) > 0)
                return this.doubleRotationRight(n);
            return n;
        };
        TreeAVL.prototype.del = function (v) {
            if (this.root)
                this.root = this._remove(this.root, v);
            return this;
        };
        TreeAVL.prototype.getBalanceFactor = function (node) {
            return !node ? 0 : this.getHeight(node.left) - this.getHeight(node.right);
        };
        TreeAVL.prototype.pop = function (v) {
            throw new Error("Method not implemented.");
        };
        TreeAVL.prototype.size = function () {
            var size = 1;
            _super.prototype.traverse.call(this, function () {
                size++;
            });
            return size;
        };
        return TreeAVL;
    }(TreeBinaryAbstract));
    Tt.TreeAVL = TreeAVL;
    var Color;
    (function (Color) {
        Color[Color["BLACK"] = 0] = "BLACK";
        Color[Color["RED"] = 1] = "RED";
    })(Color = Tt.Color || (Tt.Color = {}));
    var NodeRedBlack = (function () {
        function NodeRedBlack(_value, _left, _right, _parent, _color) {
            if (_left === void 0) { _left = null; }
            if (_right === void 0) { _right = null; }
            if (_parent === void 0) { _parent = null; }
            if (_color === void 0) { _color = Color.RED; }
            this._value = _value;
            this._left = _left;
            this._right = _right;
            this._parent = _parent;
            this._color = _color;
        }
        Object.defineProperty(NodeRedBlack.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeRedBlack.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (n) {
                this._parent = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeRedBlack.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (n) {
                this._left = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeRedBlack.prototype, "right", {
            get: function () {
                return this._right;
            },
            set: function (n) {
                this._right = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeRedBlack.prototype, "color", {
            get: function () {
                return this ? this._color : Color.BLACK;
            },
            set: function (c) {
                this._color = c;
            },
            enumerable: true,
            configurable: true
        });
        return NodeRedBlack;
    }());
    var TreeRedBlack = (function (_super) {
        __extends(TreeRedBlack, _super);
        function TreeRedBlack(compare) {
            var _this = _super.call(this, compare) || this;
            _this._root = null;
            _this._size = 0;
            return _this;
        }
        TreeRedBlack.prototype.pop = function (v) {
            throw new Error("Method not implemented.");
        };
        Object.defineProperty(TreeRedBlack.prototype, "root", {
            get: function () {
                return this._root;
            },
            set: function (node) {
                this._root = node;
            },
            enumerable: true,
            configurable: true
        });
        TreeRedBlack.prototype.rotationLeft = function (x) {
            var y = x.right;
            x.right = y.left;
            if (y.left)
                y.left.parent = x;
            y.parent = x.parent;
            if (!x.parent)
                this.root = y;
            else if (x === x.parent.left)
                x.parent.left = y;
            else
                x.parent.right = y;
            y.left = x;
            x.parent = y;
        };
        TreeRedBlack.prototype.rotationRight = function (x) {
            var y = x.left;
            x.left = y.right;
            if (y.right)
                y.right.parent = x;
            y.parent = x.parent;
            if (!x.parent)
                this.root = y;
            else if (x === x.parent.right)
                x.parent.right = y;
            else
                x.parent.left = y;
            y.right = x;
            x.parent = y;
        };
        TreeRedBlack.prototype.insert_fixup = function (x) {
            while (x !== this.root && x.parent.color == Color.RED) {
                if (x.parent === x.parent.parent.left) {
                    var y = x.parent.parent.right;
                    if (y && y.color == Color.RED) {
                        x.parent.color = Color.BLACK;
                        y.color = Color.BLACK;
                        x.parent.parent.color = Color.RED;
                        x = x.parent.parent;
                    }
                    else {
                        if (x === x.parent.right) {
                            x = x.parent;
                            this.rotationLeft(x);
                        }
                        x.parent.color = Color.BLACK;
                        x.parent.parent.color = Color.RED;
                        this.rotationRight(x.parent.parent);
                    }
                }
                else {
                    var y = x.parent.parent.left;
                    if (y && y.color === Color.RED) {
                        x.parent.color = Color.BLACK;
                        y.color = Color.BLACK;
                        x.parent.parent.color = Color.RED;
                        x = x.parent.parent;
                    }
                    else {
                        if (x === x.parent.left) {
                            x = x.parent;
                            this.rotationRight(x);
                        }
                        x.parent.color = Color.BLACK;
                        x.parent.parent.color = Color.RED;
                        this.rotationLeft(x.parent.parent);
                    }
                }
            }
            this.root.color = Color.BLACK;
        };
        TreeRedBlack.prototype.insert = function (z) {
            var y = null, x = this.root, z_cmp, x_cmp;
            while (x) {
                y = x;
                z_cmp = this.cmp(z.value);
                x_cmp = this.cmp(x.value);
                if (z_cmp < x_cmp)
                    x = x.left;
                else if (z_cmp > x_cmp)
                    x = x.right;
                else
                    return false;
            }
            z.parent = y;
            if (!y)
                this.root = z;
            else if (this.cmp(z.value) < this.cmp(y.value))
                y.left = z;
            else
                y.right = z;
            this.insert_fixup(z);
            return true;
        };
        TreeRedBlack.prototype.add = function (v) {
            if (this.insert(new NodeRedBlack(v)))
                this._size++;
            return this;
        };
        TreeRedBlack.prototype.remove_fixup = function (x) {
            while (x != this.root && x.color == Color.BLACK)
                if (x == x.parent.left) {
                    var w = x.parent.right;
                    if (w.color == Color.RED) {
                        w.color = Color.BLACK;
                        x.parent.color = Color.BLACK;
                        this.rotationLeft(x.parent);
                        w = x.parent.right;
                    }
                    if (w.left.color == Color.BLACK && w.right.color == Color.BLACK) {
                        w.color = Color.RED;
                        x = x.parent;
                    }
                    else {
                        if (w.right.color == Color.BLACK) {
                            w.left.color = Color.BLACK;
                            w.color = Color.RED;
                            this.rotationRight(w);
                            w = x.parent.right;
                        }
                        w.color = x.parent.color;
                        x.parent.color = Color.BLACK;
                        w.right.color = Color.BLACK;
                        this.rotationLeft(x.parent);
                        x = this.root;
                    }
                }
                else {
                    var w = x.parent.left;
                    if (w.color === Color.RED) {
                        w.color = Color.BLACK;
                        x.parent.color = Color.BLACK;
                        this.rotationRight(x.parent);
                        w = x.parent.left;
                    }
                    if (w.right.color === Color.BLACK && w.left.color == Color.BLACK) {
                        w.color = Color.RED;
                        x = x.parent;
                    }
                    else {
                        if (w.left.color == Color.BLACK) {
                            w.right.color = Color.BLACK;
                            w.color = Color.RED;
                            this.rotationLeft(w);
                            w = x.parent.left;
                        }
                        w.color = x.parent.color;
                        x.parent.color = Color.BLACK;
                        w.left.color = Color.BLACK;
                        this.rotationRight(x.parent);
                        x = this.root;
                    }
                }
            x.color = Color.BLACK;
        };
        TreeRedBlack.prototype.transplat = function (u, v) {
            if (!u.parent)
                this.root = v;
            else if (u === u.parent.left)
                u.parent.left = v;
            else
                u.parent.right = v;
        };
        TreeRedBlack.prototype.remove = function (z) {
            var y = z;
            var ycolor = z.color;
            var x;
            if (!z.left) {
                x = z.right;
                this.transplat(z, z.right);
            }
            else if (!z.right) {
                x = z.left;
                this.transplat(z, z.left);
            }
            else {
                y = this.min(z.right);
                ycolor = y.color;
                x = y.right;
                if (y.parent == z)
                    x.parent = y;
                else {
                    this.transplat(y, y.right);
                    y.right = z.right;
                    y.right.parent = y;
                }
                this.transplat(z, y);
                y.left = z.left;
                y.left.parent = y;
                y.color = z.color;
            }
            if (ycolor == Color.BLACK)
                this.remove_fixup(x);
        };
        TreeRedBlack.prototype.del = function (v) {
            var x = this.root, x_cmp;
            while (x) {
                x_cmp = this.cmp(x.value);
                if (v < x_cmp)
                    x = x.left;
                else if (v > x_cmp)
                    x = x.right;
                else
                    break;
            }
            if (x) {
                this.remove(x);
                this._size--;
            }
            return this;
        };
        TreeRedBlack.prototype.size = function () {
            return this._size;
        };
        return TreeRedBlack;
    }(TreeBinaryAbstract));
    Tt.TreeRedBlack = TreeRedBlack;
    var NodeSplay = (function () {
        function NodeSplay(_value, _left, _right) {
            if (_left === void 0) { _left = null; }
            if (_right === void 0) { _right = null; }
            this._value = _value;
            this._left = _left;
            this._right = _right;
        }
        Object.defineProperty(NodeSplay.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeSplay.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (n) {
                this._left = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeSplay.prototype, "right", {
            get: function () {
                return this._right;
            },
            set: function (n) {
                this._right = n;
            },
            enumerable: true,
            configurable: true
        });
        return NodeSplay;
    }());
    var SplayTree = (function (_super) {
        __extends(SplayTree, _super);
        function SplayTree(compare) {
            var _this = _super.call(this, compare) || this;
            _this._root = null;
            _this._size = 0;
            _this.header = new NodeSplay(null);
            return _this;
        }
        Object.defineProperty(SplayTree.prototype, "root", {
            get: function () { return this._root; },
            set: function (n) { this._root = n; },
            enumerable: true,
            configurable: true
        });
        SplayTree.prototype.add = function (v) {
            if (!this.root) {
                this.root = new NodeSplay(v);
                this._size++;
                return this;
            }
            this.splay(v);
            if (this.cmp(this.root.value) == v)
                return this;
            this._size++;
            var n = new NodeSplay(v);
            if (v < this.cmp(this.root.value)) {
                n.left = this.root.left;
                n.right = this.root;
                this.root.left = null;
            }
            else {
                n.right = this.root.right;
                n.left = this.root;
                this.root.right = null;
            }
            this.root = n;
            return this;
        };
        SplayTree.prototype.del = function (v) {
            this.splay(v);
            if (v != this.root.value) {
                console.warn('key not found in tree');
                return this;
            }
            this._size--;
            if (!this.root.left)
                this.root = this.root.right;
            else {
                var x = this.root.right;
                this.root = this.root.left;
                this.splay(v);
                this.root.right = x;
            }
            return this;
        };
        SplayTree.prototype.pop = function (v) {
            throw new Error("Method not implemented.");
        };
        SplayTree.prototype.size = function () {
            return this._size;
        };
        SplayTree.prototype.max = function () {
            if (!this.root)
                return null;
            var x = this.root;
            while (x.right)
                x = x.right;
            this.splay(x.value);
            return x.value;
        };
        SplayTree.prototype.min = function () {
            if (!this.root)
                return null;
            var x = this.root;
            while (x.left)
                x = x.left;
            this.splay(x.value);
            return x.value;
        };
        SplayTree.prototype.find = function (v) {
            if (!this.root)
                return null;
            this.splay(v);
            if (this.root.value != v)
                return null;
            return this.root;
        };
        SplayTree.prototype.splay = function (value) {
            var l = this.header;
            var r = this.header;
            var t = this.root;
            this.header.left = null;
            this.header.right = null;
            while (1)
                if (value < this.cmp(t.value)) {
                    if (!t.left)
                        break;
                    if (value < this.cmp(t.left.value)) {
                        var y = t.left;
                        t.left = y.right;
                        y.right = t;
                        t = y;
                        if (!t.left)
                            break;
                    }
                    r.left = t;
                    r = t;
                    t = t.left;
                }
                else if (value > this.cmp(t.value)) {
                    if (!t.right)
                        break;
                    if (value > this.cmp(t.right.value)) {
                        var y = t.right;
                        t.right = y.left;
                        y.left = t;
                        t = y;
                        if (!t.right)
                            break;
                    }
                    l.right = t;
                    l = t;
                    t = t.right;
                }
                else
                    break;
            l.right = t.left;
            r.left = t.right;
            t.left = this.header.right;
            t.right = this.header.left;
            this.root = t;
        };
        return SplayTree;
    }(TreeBinaryAbstract));
    Tt.SplayTree = SplayTree;
})(Tt || (Tt = {}));
//# sourceMappingURL=tstrees.js.map