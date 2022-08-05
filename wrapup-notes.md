

options undefined  when returning from a protclass link to a ligand prediction.

# General

- [ ] 3d align page downloads workable
- [ ] certain structs (?7k8f) don't load
- [ ] regenerate taxonomy
- [ ] create a browsable catalogue for RCSB to plug into
- [ ] species-search bugs (abstract the tax-tree component out)




# Binding Sites

- [ ] Generating .csv's for export 
	- [ ] binding site
	- [ ] prediction



# Caching/Pagination 

big structure profiles are the biggest source of lag. what depends on them:
- `VisualizationPage` uses polymer miminal representation of data
- most of the fetching is done in `/src/components/Main.tsx`
- given that a lot of front-facing functionality (filters in particular) depends on the monolithic neostruct array being available -- let's just fetch it in the background but populate pages gradually. 
