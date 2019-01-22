API Docs: https://documenter.getpostman.com/view/3583799/Rztfur3z

Database:
#1 master_tax_codes
Master table for tax codes
| index | name | Description |
| --- | --- | --- |
| **PK**  | `id` | The tax codes |
| | `name` | Tax code name |
| | `created_at` | Timestamp |
| | `modified_at` | Timestamp |


#2 bills
Table to save bill id
| index | name | Description |
| --- | --- | --- |
| **PK**  | `id` | Bill id |
| | `created_at` | Timestamp |
| | `modified_at` | Timestamp |


#3 items
Save items from users input
| index | name | Description |
| --- | --- | --- |
| **PK**  | `id` | item id |
| **FK**  | `tax_code_id` | The tax code, reference to `master_tax_codes` table |
| **FK**  | `bill_ id` | Bill id reference to `bills` table |
| | `name` | Item name |
| | `price` | Item price |
| | `created_at` | Timestamp |
| | `modified_at` | Timestamp |