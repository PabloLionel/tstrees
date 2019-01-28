namespace Tt {
    export enum travelMode {
        PREORDER,
        INORDER,
        POSTORDER
    }
    interface INode<T> {
        value   : T,
        left    : INode<T> | null,
        right   : INode<T> | null
    }
    interface INodeAVL<T> {
        value   : T,
        left    : INodeAVL<T> | null,
        right   : INodeAVL<T> | null,
        height  : number // Factor de Equilibrio
    }
    type INODE =    INode<any> |
                    INodeAVL<any> | 
                    INodeRedBlack<any> |
                    INodeSplay<any> |
                    null
    interface ITree<T> { // N: type node
        cmp: Function,
        add(v: T)       : ITree<T>,
        del(v: T)       : ITree<T>,
        pop(v: T)       : T,// ademas de remover un nodo devuelve su contendio
        find(v: T)      : INODE, // any: cualquier tipo de INodo(nodo, avl, rb, splay, ...)
        contains(v: T)  : boolean, //util para saber si un valor se encuentra en el árbol
        traverse(
            process     : Function,
            order       : travelMode
        )               : void,// recorrer todo el árbol, segun sea el valor de order, y obtener los valores de cada nodo a los cuales aplica el callback
        size()          : number,
        toArray()       : Array<T>,
        toJson()        : Object,
        min(n?: any)    : any,// valor minimo
        max(n?: any)    : any,// valor maximo
        isEmpty()       : boolean
    }
    abstract class TreeBinaryAbstract<T> implements ITree<T> {
        private _cmp: Function = (val: T) => val // default comaprator
        constructor(compare?: Function) {
            if (typeof compare === 'function') 
                this._cmp = compare
        }
        abstract root       : INODE
        abstract add(v: T)  : any
        abstract del(v: T)  : any
        abstract pop(v: T)  : T
        abstract size()     : number
        set cmp(v: Function) {
            this._cmp = v
        }
        get cmp(): Function {
            return this._cmp
        }
        private _find(v: T, p: INODE): INODE {
            if (!p)
                return null
            let v_cmp = this.cmp(p.value)
            if (v == v_cmp)
                return p
            else if (v < v_cmp)
                return this._find(v, p.left)
            else
                return this._find(v, p.right)
        }
        find(v: T): INODE {
            return this._find(v, this.root)
        }
        private _contains(v: any, n: any): boolean {
            if (!n)
                return false
            let v_cmp = this.cmp(n.value)
            if (v < v_cmp)
                return this._contains(v, n.left)
            else if (v > v_cmp)
                return this._contains(v, n.right)
            else
                return true
        }
        contains(v: T): boolean {
            return this._contains(v, this.root)
        }
        traverse(process: Function, order: travelMode = travelMode.INORDER): void {
            switch (order) {
                case travelMode.PREORDER:
                    this.preOrder(process, this.root)
                    break
                case travelMode.INORDER:
                    this.inOrder(process, this.root)
                    break
                case travelMode.POSTORDER:
                    this.postOrder(process, this.root)
            }
        }
        protected preOrder(process: Function, n: INODE): void {
            if (!n) return
            process.call(this, n)
            this.preOrder(process, n.left)
            this.preOrder(process, n.right)
        }
        protected inOrder(process: Function, n: INODE): void {
            if (!n) return
            this.inOrder(process, n.left)
            process.call(this, n)
            this.inOrder(process, n.right)
        }
        protected postOrder(process: Function, n: INODE): void {
            if (!n) return
            this.postOrder(process, n.left)
            this.postOrder(process, n.right)
            process.call(this, n)
        }
        toArray(): T[] {
            let res: T[] = []
            this.traverse((n: INode<T>) => {
                res.push(n.value)
            });
            return res
        }
        toJson(): Object {
            const helper = (node: INODE) => {
                const res: any = {}
                if (!node) return null
                res['left'] = helper(node.left)
                res['value'] = node.value
                res['right'] = helper(node.right)
                return res
            }
            return JSON.stringify(helper(this.root), null, 2)
        }
        min(node?: INODE) {
            let temp
            if (node)
                temp = node
            else
                temp = this.root
            if (temp)
                while (temp.left)
                    temp = temp.left
            return temp
        }
        max(node?: INODE) {
            let tmp
            if (node)
                tmp = node
            else
                tmp = this.root
            if (tmp)
                while (tmp.right)
                    tmp = tmp.right
            return tmp
        }
        isEmpty(): boolean {
            return !this.root
        }
    }
    class Node<T> implements INode<T> {
        constructor(
            private _value  : T,
            private _left   : INode<T> | null = null,
            private _right  : INode<T> | null = null
        ) { }
        set value(v: T) {
            this._value = v
        }
        get value(): T {
            return this._value
        }
        set left(n: INode<T> | null) {
            this._left = n
        }
        get left(): INode<T> | null {
            return this._left
        }
        set right(n: INode<T> | null) {
            this._right = n
        }
        get right(): INode<T> | null {
            return this._right
        }
    }
    export class Tree<T> extends TreeBinaryAbstract<T> {
        // de correr en un servidor, hacemos asignación temprana.
        private _root: INode<T> | null = null
        private _size: number = 0
        constructor(compare?: Function) {
            super(compare)
        }
        set root(n: INode<T> | null) {
            this._root = n
        }
        get root(): INode<T> | null {
            return this._root
        }
        size() {
            return this._size
        }
        private insert(n: INode<T> | null, p: INode<T> | null): INode<T> | null {
            if (!p)
                return n
            let v_cmp_n = this.cmp(n!.value)
            let v_cmp_p = this.cmp(p.value)
            if (v_cmp_n < v_cmp_p)
                p.left = this.insert(n, p.left)
            else if (v_cmp_n > v_cmp_p)
                p.right = this.insert(n, p.right)
            else
                this._size-- // no inserta el nodo porque ya existe
            return p
        }
        add(v: T): Tree<T> {
            this.root = this.insert(new Node(v), this.root)
            this._size++
            return this
        }
        private remove(v: T, c: INode<T> | null, v_tmp: T) {
            if (!c) // empty tree
                return null
            let c_cmp = this.cmp(c.value)
            if (v < c_cmp) // value is less than node's number. so go to left subtree
                c.left = this.remove(v, c.left, v_tmp);
            else if (v > c_cmp) // value is greater than node's number. so go to right subtree
                c.right = this.remove(v, c.right, v_tmp)
            else {// node found. Let's delete it!
                if (v === v_tmp) this._size--
                //node has no child
                if (!c.left && !c.right)
                    c = null
                else if (!c.left) // node has only right child
                    c = c.right
                else if (!c.right) // node has only left child
                    c = c.left
                else {// node has two children
                    let tmp = this.min(c.right)
                    // ! para ignorar el error TS2533: Objeto es posiblemente 'nulo' o 'no definido'
                    c.value = tmp!.value
                    c.right = this.remove(tmp!.value, c.right, v_tmp)
                }
            }
            return c
        }
        del(v: T): Tree<T> {
            this.root = this.remove(v, this.root, v)
            return this
        }
        pop(v: T): T {
            throw new Error("Method not implemented.");
        }
    }
    class NodeAVL<T> implements INodeAVL<T> {
        constructor(
            private _value  : T,
            private _left   : INodeAVL<T> | null = null,
            private _right  : INodeAVL<T> | null = null,
            private _height : number = 0
        ) { }
        set value(v: T) {
            this._value = v
        }
        get value(): T {
            return this._value
        }
        set left(n: INodeAVL<T> | null) {
            this._left = n
        }
        get left(): INodeAVL<T> | null {
            return this._left
        }
        set right(n: INodeAVL<T> | null) {
            this._right = n
        }
        get right(): INodeAVL<T> | null {
            return this._right
        }
        set height(h: number) {
            this._height = h
        }
        get height(): number {
            return this._height
        }
    }
    export class TreeAVL<T> extends TreeBinaryAbstract<T> {
        private _root: INodeAVL<T> | null = null
        constructor(compare?: Function) {
            super(compare)
        }
        set root(root: INodeAVL<T> | null) {
            this._root = root
        }
        get root(): INodeAVL<T> | null {
            return this._root
        }
        private getHeight(node: INodeAVL<T> | null): number {
            return node ? node.height : -1
        }
        // Simple rotation on the left
        private rotationLeft(n: INodeAVL<T> | null): INodeAVL<T> | null {
            let tmp = n!.left
            n!.left = tmp!.right
            tmp!.right = n
            n!.height = 1 + Math.max(this.getHeight(n!.left), this.getHeight(n!.right))
            tmp!.height = 1 + Math.max(this.getHeight(tmp!.left), this.getHeight(tmp!.right))
            return tmp
        }
        // Simple rotation on the right
        private rotationRight(n: INodeAVL<T> | null): INodeAVL<T> | null {
            let tmp = n!.right
            n!.right = tmp!.left
            tmp!.left = n
            n!.height = 1 + Math.max(this.getHeight(n!.left), this.getHeight(n!.right))
            tmp!.height = 1 + Math.max(this.getHeight(tmp!.left), this.getHeight(tmp!.right))
            return tmp
        }

        // Double rotation on the left
        private doubleRotationLeft(n: INodeAVL<T> | null): INodeAVL<T> | null {
            n!.left = this.rotationRight(n!.left)
            let tmp = this.rotationLeft(n)
            return tmp
        }
        // Double rotation on the right
        private doubleRotationRight(n: INodeAVL<T> | null): INodeAVL<T> | null {
            n!.right = this.rotationLeft(n!.right)
            let tmp = this.rotationRight(n)
            return tmp
        }
        private insert(n: INodeAVL<T> | null, c: INodeAVL<T> | null): INodeAVL<T> | null {
            let newParent = c,
                n_cmp = this.cmp(n!.value),
                c_cmp = this.cmp(c!.value)
            if (n_cmp < c_cmp)
                if (!c!.left)
                    c!.left = n
                else {
                    newParent!.left = this.insert(n, c!.left)
                    if (this.getHeight(c!.left) - this.getHeight(c!.right) == 2) // desbalance
                        if (n_cmp < this.cmp(c!.left!.value))
                            newParent = this.rotationLeft(c)
                        else {
                            newParent = this.doubleRotationLeft(c)
                        }
                }
            else if (n_cmp > c_cmp)
                if (!c!.right)
                    c!.right = n
                else {
                    newParent!.right = this.insert(n, c!.right)
                    if (this.getHeight(c!.right) - this.getHeight(c!.left) == 2)
                        if (n_cmp > this.cmp(c!.right!.value))
                            newParent = this.rotationRight(c)
                        else
                            newParent = this.doubleRotationRight(c)
                }
            // Actualizar altura ( o factor de equilibrio )
            if (!c!.left && c!.right)
                c!.height = 1 + this.getHeight(c!.right)
            else if (!c!.right && c!.left)
                c!.height = 1 + this.getHeight(c!.left)
            else
                c!.height = 1 + Math.max(this.getHeight(c!.left), this.getHeight(c!.right))
            // Asignar la el nuevo padre a la raiz
            return newParent
        }
        add(v: T): TreeAVL<T> {
            if (this.root)
                this.root = this.insert(new NodeAVL(v), this.root)
            else
                this.root = new NodeAVL(v)
            return this
        }
        private _remove(n: INodeAVL<T> | null, v: T): INodeAVL<T> | null {
            if (!n)
                return n
            let n_cmp = this.cmp(n.value)
            if (v < n_cmp)
                n.left = this._remove(n.left, v)
            else if (v > n_cmp)
                n.right = this._remove(n.right, v)
            else {
                let temp
                if (!n.left) {
                    temp = n.right
                    n = null
                    return temp
                } else if (!n.right) {
                    temp = n.left
                    n = null
                    return temp
                }
                temp = super.min(n.right)
                n.value = temp!.value
                n.right = this._remove(n.right, temp!.value)
            }
            // Si el árbol tiene solo un nodo,
            // simplemente devuélvelo
            if (!n)
                return n
            // Paso 2 - Actualiza la altura del
            // nodo ancestro
            n.height = 1 + Math.max(this.getHeight(n.left), this.getHeight(n.right))
            // Paso 3: obtener el factor de equilibrio
            let balance = this.getBalanceFactor(n)
            // Paso 4: si el nodo está desequilibrado,
            // luego prueba los 4 casos
            // Caso 1 - Izquierda Izquierda
            if (balance > 1 && this.getBalanceFactor(n.left) >= 0)
                return this.rotationLeft(n)
            //Caso 2 - Derecha Derecha
            if (balance < -1 && this.getBalanceFactor(n.right) <= 0)
                return this.rotationRight(n)
            // Caso 3 - Izquierda Derecha
            if (balance > 1 && this.getBalanceFactor(n.left) < 0)
                return this.doubleRotationLeft(n)
            // Caso 4 - Derecha Izquierda
            if (balance < -1 && this.getBalanceFactor(n.right) > 0)
                return this.doubleRotationRight(n)
            return n
        }
        del(v: T): TreeAVL<T> {
            if (this.root)
                this.root = this._remove(this.root, v)
            return this
        }
        private getBalanceFactor(node: INodeAVL<T> | null): number {
            return !node ? 0 : this.getHeight(node.left) - this.getHeight(node.right)
        }
        pop(v: T): T {
            throw new Error("Method not implemented.");
        }
        size(): number {
            let size: number = 0
            super.traverse(() => {
                size++
            })
            return size
        }
    }
    export enum Color {
        BLACK,
        RED
    }
    interface INodeRedBlack<T> {
        value: T,
        parent: INodeRedBlack<T> | null,
        left: INodeRedBlack<T> | null,
        right: INodeRedBlack<T> | null,
        color: Color
    }
    class NodeRedBlack<T> implements INodeRedBlack<T> {
        constructor(
            private _value  : T,
            private _color  : Color = Color.RED,
            private _parent : INodeRedBlack<T> | null = null,
            private _left   : INodeRedBlack<T> | null = null,
            private _right  : INodeRedBlack<T> | null = null
        ) { }
        set value(v: T) {
            this._value = v
        }
        get value(): T {
            return this._value
        }
        set parent(n: INodeRedBlack<T> | null) {
            this._parent = n
        }
        get parent(): INodeRedBlack<T> | null {
            return this._parent
        }
        set left(n: INodeRedBlack<T> | null) {
            this._left = n
        }
        get left(): INodeRedBlack<T> | null {
            return this._left
        }
        set right(n: INodeRedBlack<T> | null) {
            this._right = n
        }
        get right(): INodeRedBlack<T> | null {
            return this._right
        }
        set color(c: Color) {
            this._color = c
        }
        get color(): Color {
            return this ? this._color : Color.BLACK
        }
    }
    export class TreeRedBlack<T> extends TreeBinaryAbstract<T> {
        pop(v: T): T {
            throw new Error("Method not implemented.");
        }
        private _root: INodeRedBlack<T> | null = null
        private _size: number = 0
        constructor(compare?: Function) { super(compare) }
        set root(node: INodeRedBlack<T> | null) { this._root = node }
        get root(): INodeRedBlack<T> | null { return this._root }
        /** 
         * Simple rotation on the left
         * Left-rotates node x on tree T.
                     x
                    / \
                   a   y
                      / \
                     b   g
      
         * mutates into:
      
                     y
                    / \
                   x   g
                  / \
                 a   b
         * Used for maintaining tree balance.
         */
        private rotationLeft(x: INodeRedBlack<T> | null) {
            let y = x!.right
            x!.right = y!.left
            if (y!.left) y!.left!.parent = x
            y!.parent = x!.parent
            if (!x!.parent)
                this.root = y
            else if (x === x!.parent!.left)
                x!.parent!.left = y
            else
                x!.parent!.right = y
            y!.left = x
            x!.parent = y
        }
        /**
         * Simple rotation on the right
         * Right-rotates node x on tree T.
         *           x
                    / \
                   y   g
                  / \
                 a   b
          mutates into:
      
                     y
                    / \
                   a   x
                      / \
                     b   g
          Used for maintaining tree balance.
         */
        private rotationRight(x: INodeRedBlack<T> | null) {
            let y = x!.left
            x!.left = y!.right
            if (y!.right) y!.right!.parent = x
            y!.parent = x!.parent
            if (!x!.parent)
                this.root = y
            else if (x === x!.parent!.right)
                x!.parent!.right = y
            else
                x!.parent!.left = y
            y!.right = x
            x!.parent = y
        }
        private insert_fixup(x: INodeRedBlack<T> | null): void {
            while (x !== this.root && x!.parent!.color == Color.RED) {
                if (x!.parent === x!.parent!.parent!.left) {
                    let y = x!.parent!.parent!.right
                    if (y && y.color == Color.RED) {
                        x!.parent!.color = Color.BLACK
                        y.color = Color.BLACK
                        x!.parent!.parent!.color = Color.RED
                        x = x!.parent!.parent
                    } else {
                        if (x === x!.parent!.right) {
                            x = x!.parent
                            this.rotationLeft(x)
                        }
                        x!.parent!.color = Color.BLACK
                        x!.parent!.parent!.color = Color.RED
                        this.rotationRight(x!.parent!.parent)
                    }
                } else {
                    let y = x!.parent!.parent!.left
                    if (y && y.color === Color.RED) {
                        x!.parent!.color = Color.BLACK
                        y.color = Color.BLACK
                        x!.parent!.parent!.color = Color.RED
                        x = x!.parent!.parent
                    } else {
                        if (x === x!.parent!.left) {
                            x = x!.parent
                            this.rotationRight(x)
                        }
                        x!.parent!.color = Color.BLACK
                        x!.parent!.parent!.color = Color.RED
                        this.rotationLeft(x!.parent!.parent)
                    }
                }
            }
            this.root!.color = Color.BLACK
        }
        private insert(z: INodeRedBlack<T> | null): boolean {
            let y = null,
                x = this.root,
                z_cmp,
                x_cmp
            while (x) {
                y = x
                z_cmp = this.cmp(z!.value)
                x_cmp = this.cmp(x.value)
                if (z_cmp < x_cmp)
                    x = x.left
                else if (z_cmp > x_cmp)
                    x = x.right
                else
                    return false// throw new Error(`${z.value()} ya se encuentra cargado`)
            }
            z!.parent = y
            if (!y)
                this.root = z
            else if (this.cmp(z!.value) < this.cmp(y.value))
                y.left = z
            else
                y.right = z
            this.insert_fixup(z)
            return true
        }
        add(v: T): TreeRedBlack<T> {
            if (this.insert(new NodeRedBlack(v)))
                this._size++
            return this
        }
        private remove_fixup(x: INodeRedBlack<T>) {
            if (!x) return
            while (x != this.root && x.color == Color.BLACK)
                if (x == x.parent!.left) {
                    let w = x.parent!.right
                    if (w!.color == Color.RED) {
                        w!.color = Color.BLACK
                        x!.parent!.color = Color.BLACK
                        this.rotationLeft(x.parent)
                        w = x.parent!.right
                    }
                    if (w!.left!.color == Color.BLACK && w!.right!.color == Color.BLACK) {
                        w!.color = Color.RED
                        x = x!.parent!
                    } else {
                        if (w!.right!.color == Color.BLACK) {
                            w!.left!.color = Color.BLACK
                            w!.color = Color.RED
                            this.rotationRight(w)
                            w = x!.parent!.right
                        }
                        w!.color = x.parent!.color
                        x!.parent!.color = Color.BLACK
                        w!.right!.color = Color.BLACK
                        this.rotationLeft(x!.parent)
                        x = this.root!
                    }
                } else {
                    let w = x.parent!.left
                    if (w!.color === Color.RED) {
                        w!.color = Color.BLACK
                        x!.parent!.color = Color.BLACK
                        this.rotationRight(x!.parent)
                        w = x.parent!.left
                    }
                    if (w!.right!.color === Color.BLACK && w!.left!.color == Color.BLACK) {
                        w!.color = Color.RED
                        x = x!.parent!
                    } else {
                        if (w!.left!.color == Color.BLACK) {
                            w!.right!.color = Color.BLACK
                            w!.color = Color.RED
                            this.rotationLeft(w)
                            w = x.parent!.left
                        }
                        w!.color = x.parent!.color
                        x!.parent!.color = Color.BLACK
                        w!.left!.color = Color.BLACK
                        this.rotationRight(x!.parent)
                        x = this.root!
                    }
                }
            x!.color = Color.BLACK
        }
        private transplat(u: INodeRedBlack<T>, v: INodeRedBlack<T>) {
            if (!u.parent)
                this.root = v
            else if (u === u.parent.left)
                u.parent.left = v
            else
                u.parent.right = v
        }
        private remove(z: INodeRedBlack<T>) {
            let y: any = z,
            ycolor = z.color,
            x
            if (!z.left) {
                x = z.right
                this.transplat(z, z.right!)
            } else if (!z.right) {
                x = z.left
                this.transplat(z, z.left)
            } else {
                y = this.min(z.right)
                ycolor = y.color
                x = y.right
                if (y.parent == z)
                    x!.parent = y
                else {
                    this.transplat(y, y.right!)
                    y.right = z.right
                    y.right.parent = y
                }
                this.transplat(z, y)
                y.left = z.left
                y.left.parent = y
                y.color = z.color
            }
            if (ycolor == Color.BLACK)
                this.remove_fixup(x!)
        }
        del(v: T): TreeRedBlack<T> {
            let x = this.root,
                x_cmp;
            // debugger
            while (x) {
                x_cmp = this.cmp(x.value)
                if (v < x_cmp)
                    x = x.left
                else if (v > x_cmp)
                    x = x.right
                else
                    break
            }
            if (x) {
                this.remove(x)
                this._size--
            } // else console.warn(`${v} no se encuentra`)// throw `${value} ya se encuetra almacenado!`
            return this
        }
        size(): number {
            return this._size
        }
    }
    interface INodeSplay<T> {
        value: T,
        left: INodeSplay<T> | null,
        right: INodeSplay<T> | null
    }
    class NodeSplay<T> implements INodeSplay<T> {
        constructor(
            private _value: T,
            private _left: INodeSplay<T> | null = null,
            private _right: INodeSplay<T> | null = null
        ) { }
        set value(v: T) {
            this._value = v
        }
        get value(): T {
            return this._value
        }
        set left(n: INodeSplay<T> | null) {
            this._left = n
        }
        get left(): INodeSplay<T> | null {
            return this._left
        }
        set right(n: INodeSplay<T> | null) {
            this._right = n
        }
        get right(): INodeSplay<T> | null {
            return this._right
        }
    }
    export class SplayTree<T> extends TreeBinaryAbstract<T> {
        private _root: INodeSplay<T> | null = null
        private header: INodeSplay<T>
        private _size: number = 0
        constructor(compare?: Function) {
            super(compare)
            this.header = new NodeSplay(null!)
        }
        set root(n: INodeSplay<T> | null) { this._root = n }
        get root(): INodeSplay<T> | null { return this._root }

        add(v: T): SplayTree<T> {
            if (!this.root) {
                this.root = new NodeSplay(v)
                this._size++
                return this
            }

            this.splay(v)
            if (this.cmp(this.root.value) == v) // If the key is already there in the tree, don't do anything.
                return this

            this._size++
            let n = new NodeSplay(v)
            if (v < this.cmp(this.root.value)) {
                n.left = this.root.left
                n.right = this.root
                this.root.left = null
            } else {
                n.right = this.root.right
                n.left = this.root
                this.root.right = null
            }

            this.root = n

            return this
        }

        del(v: T): SplayTree<T> {
            this.splay(v)
            if (v != this.root!.value) 
                return this
            
            this._size--
            // Now delete the root.
            if (!this.root!.left)
                this.root = this.root!.right
            else {
                let x = this.root!.right
                this.root = this.root!.left
                this.splay(v)
                this.root!.right = x
            }
            return this
        }
        pop(v: T): T {
            throw new Error("Method not implemented.");
        }
        size(): number {
            return this._size
        }
        max(): any {
            if (!this.root)
                return null
            let x = this.root
            while (x.right)
                x = x.right
            this.splay(x.value)
            return x.value
        }
        min(): any {
            if (!this.root)
                return null
            let x = this.root
            while (x.left)
                x = x.left
            this.splay(x.value)
            return x.value
        }
        find(v: T): any {
            if (!this.root)
                return null
            this.splay(v)
            if (this.root.value != v)
                return null
            return this.root
        }
        private splay(v: T) {
            let l: any = this.header
            let r: any = this.header
            let t: any = this.root
            this.header.left = null
            this.header.right = null
            while (1)
                if (v < this.cmp(t!.value)) {
                    if (!t.left)
                        break
                    if (v < this.cmp(t!.left!.value)) {
                        let y = t!.left
                        t!.left = y!.right
                        y.right = t
                        t = y
                        if (!t!.left)
                            break
                    }
                    r.left = t
                    r = t
                    t = t!.left
                } else if (v > this.cmp(t!.value)) {
                    if (!t!.right)
                        break
                    if (v > this.cmp(t!.right.value)) {
                        let y = t.right
                        t.right = y.left
                        y.left = t
                        t = y
                        if (!t.right)
                            break
                    }
                    l.right = t
                    l = t
                    t = t.right
                } else
                    break
            l.right = t.left
            r.left = t.right
            t.left = this.header.right
            t.right = this.header.left
            this.root = t
        }
    }
}