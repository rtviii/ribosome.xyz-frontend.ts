Redux is responsible for two types of state in the application:
1. Data State. (__i__ Fetching and __ii__ transforming data locally for the purposes of presentation or calculation:string parsing, dates, whatnot)
    ### Data Reducer
    - Neo4j requests
        - Structures Reducer
        - RPs Reducers

2. UI State. The general behavior and interaction of presentation-components. Every widget, toggle, slide-in and filter that drawson state but does __not__ mutate it.
    ### UI Reducer
    - Workspace
    - ..


