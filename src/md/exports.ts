import ligs from './home/ligands.md'
import prots from './home/proteins.md'
import exittunnel from './home/tunnel.md'
import limitations from './home/limitations.md'
import rna from './home/rrna.md'

// -----------------------------------
import structures from './structs/structs.md'
// -----------------------------------
import rps_page from './rps/rps.md'
import ligands_page from './ligands/ligands.md' 
import rnas_page from './rnas/rnas.md'
import interfaces_page from './interfaces/interfaces.md'
import tunnel_page from './tunnel/tunnel.md'

const home = {
    prots,
    exittunnel,
    ligs,
    rna,
    limitations
}

const structs = {
    structures
}

const rps={
    rps_page
}

const ligands={
    ligands_page
}

const rnas={
    rnas_page
}

const interfaces={

    interfaces_page
}

const tunnel={
    tunnel_page
}


export const all={

home,structs,rps,ligands,rnas,interfaces,tunnel
}