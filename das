raw_aln = cmd.get_raw_alignment('SSU6EC_SSU6PF')

idx2resi = {}

cmd.iterate('SSU6EC_SSU6PF', 'idx2resi[model, index] = resi', space={'idx2resi': idx2resi})

for idx1, idx2 in raw_aln:

    print('%s -> %s' % (idx2resi[idx1], idx2resi[idx2]))

python end



disable all