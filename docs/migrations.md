#### Migrations

TypedDB has first-class support for migrations. Here is an example of a TypedDB migration file:

```typescript
import { Database, Type } from 'typed-db'

export function up(db: Database) {
  db.orders.addProperty('discount', Type.number)
    .orders.update({ discount: 0 })
}

export function down(db: Database) {
  db.orders.removeProperty('discount')
}
```

In the future, some down migrations could be automatically generated based on the up migration.
TypedDB could check if it's possible when running the up migration, and report to the user if not.
