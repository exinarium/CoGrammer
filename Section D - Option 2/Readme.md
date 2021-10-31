## Time Complexity

### 3.1 Current Scenario Time Complexity

I will determine the time complexity using the Big O notation. The current code can be seen below. The lines are numbered for easy reference:

```
1. let next //O(1)

//Determine last item in collection and set to next
2. for (next = this.#next; next && next.#next; next = next.#next); //O(n)

//If this is last item
3. if (!next) {
4.      next = this //O(1)
    }

//Set new item as last item
5.next.#next = new Collection(value) //O(1)
```

* Line 1 is a constant statement with a notation O(1).
* Line 2 is a for-loop that grows with the number of items in the collection and this has a notation of O(n)
* Line 3 & 4 is a condition that will execute worst-case with a constant statement. Therefore a notation of O(1)
* Line 5 is a constant statement with notation O(1)

Therefore the worst-case time complexity of the function is O(n) as it takes longer the more items the collection contains.

### 3.2 Improvement

The only way to lessen the time complexity is to reduce the O(n) to either an O(log n) complexity (which takes longer initially, but becomes steady over time) or an O(1) complexity.

#### 3.2.1 Improved scenario

In this scenario we introduce a static variable called #lastCollection. This allows the first collection to keep a reference to the last collection. See the code below:

```
class Collection {
    #value
    #next
    static #lastCollection

    constructor(value, next) {
        this.#value = value

        if (next) {
            this.#next = new Collection(next)
            Collection.lastCollection = this.#next
        }
        else {
            this.#next = null
            Collection.#lastCollection = this
        }
    }

    get value() {
        return this.#value
    }

    get next() {
        return this.#next
    }

    get lastCollection() {
        return this.#lastCollection
    }

    get lastCollection() {}

    add(value) {
        Collection.#lastCollection.#next = new Collection(value)
    }
}
```

* Due to the fact that the add method only now contains 1 statement, which has a complexity of O(1), the worst case complexity of the method is now O(1)
* The lastCollection is always set by the constructor of the new Collection

#### 3.2.2 Second improved scenario

Unfortunately I could not think of another way to reduce the complexity to O(1) or O(log n) using the linked list structure.