# Recoil RFC

This project is a comparison of how the same page would be implemented using three different methods: local state, recoil, and React Context. The page is a simple page that uses react query to fetch data from rick and morty API, and handles search, pagination, and filtering. 

[Basic Example](src/pages/basic.tsx)

[Recoil Example](src/pages/recoil.tsx)

[Context Example](src/pages/context.tsx)

The primary differences between these three pages is how it keeps track of the current page, search term, and filters while keeping the pieces separated out into components. 

## Running Locally

```bash
yarn
yarn dev
```