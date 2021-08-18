declare module "*.jpg";
declare module "*.gif";
declare module "*.md";

declare module '@plotly/react-msa-viewer';

declare namespace JSX {
    interface IntrinsicElements{
        "pdb-topology-viewer":any,
        "pdbe-molstar":any
    }
}