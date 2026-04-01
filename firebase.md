### **Queries :** 

**exaample data**
```
import { collection, doc, setDoc } from "firebase/firestore"; 

const citiesRef = collection(db, "cities");

await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
await setDoc(doc(citiesRef, "LA"), {
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
await setDoc(doc(citiesRef, "DC"), {
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
await setDoc(doc(citiesRef, "TOK"), {
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
await setDoc(doc(citiesRef, "BJ"), {
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });
```

 **1. The following query returns all cities with state CA:**
```
import { collection, query, where } from "firebase/firestore";
const citiesRef = collection(db, "cities");
const q = query(citiesRef, where("state", "==", "CA"));
```


**2. The following query returns all the capital cities:**
```
import { collection, query, where } from "firebase/firestore";
const citiesRef = collection(db, "cities");
const q = query(citiesRef, where("capital", "==", true));
```

**3. use where() for filter** 
```
const stateQuery = query(citiesRef, where("state", "==", "CA"));
const populationQuery = query(citiesRef, where("population", "<", 100000));
const nameQuery = query(citiesRef, where("name", ">=", "San Francisco"));
```

**4. Not equal (!=)**
```
const notCapitalQuery = query(citiesRef, where("capital", "!=", false));
```
_This query returns every city document where the capital field exists with a value other than false or null_


**5. Array membership** 

> You can use the array-contains operator to filter based on array values. For example:
```
import { query, where } from "firebase/firestore";  
const q = query(citiesRef, where("regions", "array-contains", "west_coast"));
```

_This query returns every city document where the regions field is an array that contains west_coast_


**in, not-in, and array-contains-any**

**1. in**
```
import { query, where } from "firebase/firestore";
const q = query(citiesRef, where('country', 'in', ['USA', 'Japan']));
```

_This query returns every city document where the country field is set to USA or Japan. From the example data, this includes the SF, LA, DC, and TOK documents._

**2. not-in**
```
import { query, where } from "firebase/firestore";
const q = query(citiesRef, where('country', 'not-in', ['USA', 'Japan']));
```

_This query returns every city document where the country field exists and is not set to USA, Japan, or null.From the example data, this includes the London and Hong Kong documents._

**3. array-contains-any**
```
import { query, where } from "firebase/firestore";  
const q = query(citiesRef, 
  where('regions', 'array-contains-any', [['west_coast'], ['east_coast']]));
  ```

_This query returns every city document where the regions field is an array that contains west_coast or east_coast. From the example data, this includes the SF, LA, and DC documents._

**6. AND & OR**
``` 
const q = query(collection(db, "cities"), and(
  where('state', '==', 'CA'),   
  or(
    where('capital', '==', true),
    where('population', '>=', 1000000)
  )
));
```

_in this query AND condition satate == CA is mendatory to match and OR contains two conditions, from there atlest one condition need to match._


**7. Order & Limit**

_For example, you could query for the first 3 cities alphabetically with:_
```
import { query, orderBy, limit } from "firebase/firestore";  
const q = query(citiesRef, orderBy("name"), limit(3));
```

_You could also sort in descending order to get the last 3 cities:_
```
import { query, orderBy, limit } from "firebase/firestore";  
const q = query(citiesRef, orderBy("name", "desc"), limit(3));
```

_You can also order by multiple fields. For example, if you wanted to order by state, and within each state order by population in descending order:_
```
import { query, orderBy } from "firebase/firestore";  
const q = query(citiesRef, orderBy("state"), orderBy("population", "desc"));
```

_You can combine where() filters with orderBy() and limit(). In the following example, the queries define a population threshold, sort by population in ascending order, and return only the first few results that exceed the threshold:_
```
import { query, where, orderBy, limit } from "firebase/firestore";  
const q = query(citiesRef, where("population", ">", 100000), orderBy("population"), limit(2));
```

**for reference**

https://firebase.google.com/docs/firestore/query-data/get-data

https://firebase.google.com/docs/firestore/query-data/queries

https://firebase.google.com/docs/firestore/query-data/order-limit-data

https://firebase.google.com/docs/firestore/query-data/aggregation-queries

https://firebase.google.com/docs/firestore/query-data/query-cursors


