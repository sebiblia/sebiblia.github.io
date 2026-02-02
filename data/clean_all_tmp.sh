#!/bin/bash

CURR_DIR=$(pwd)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "clean ${1} using "${BASH_SOURCE[0]}

cd $SCRIPT_DIR

rm ./Makefile
rm ./bib_tabs/ALE_bib.tab
rm ./bib_tabs/BYZ_bib.tab
rm ./bib_tabs/LXX_bib.tab
rm ./bib_tabs/NES_bib.tab
rm ./bib_tabs/TKH_bib.tab
rm ./bib_tabs/TR_bib.tab
rm ./bib_tabs/WH_bib.tab
rm ./bib_tabs/WLC_bib.tab
rm ./js_mutu/mut_ref.tab
rm ./js_refs/FULL_VERSE_REFS.tab
rm ./js_roots/roots_ref.tab
rm ./js_scods/ALE_sref.tab
rm ./js_scods/BYZ_sref.tab
rm ./js_scods/LXX_sref.tab
rm ./js_scods/NES_sref.tab
rm ./js_scods/TKH_sref.tab
rm ./js_scods/TR_sref.tab
rm ./js_scods/WH_sref.tab
rm ./js_scods/WLC_sref.tab
rm ./loc_tabs/KJVs_bib.tab
rm ./loc_tabs/KJVs_bib.tab.fix
rm ./loc_tabs/RVAs_bib.tab
rm ./loc_tabs/RVAs_bib.tab.fix
rm ./loc_tabs/socu_BYZ_KJVs.tab
rm ./loc_tabs/socu_BYZ_RVAs.tab
rm ./loc_tabs/SOCU_KJV.tab
rm ./loc_tabs/SOCU_RVA.tab
rm ./loc_tabs/socu_WLC_KJVs.tab
rm ./loc_tabs/socu_WLC_RVAs.tab
rm ./loc_tabs/sql3_KJVs.tab
rm ./loc_tabs/sql3_RVAs.tab
rm ./loc_tabs/stra_BYZ_KJVs.tab
rm ./loc_tabs/stra_BYZ_RVAs.tab
rm ./loc_tabs/STRA_KJV.tab
rm ./loc_tabs/STRA_RVA.tab
rm ./loc_tabs/stra_WLC_KJVs.tab
rm ./loc_tabs/stra_WLC_RVAs.tab
rm ./js_sbib/ALE_sbib.tab
rm ./js_sbib/BYZ_sbib.tab
rm ./js_sbib/LXX_sbib.tab
rm ./js_sbib/NES_sbib.tab
rm ./js_sbib/TKH_sbib.tab
rm ./js_sbib/TR_sbib.tab
rm ./js_sbib/WH_sbib.tab
rm ./js_sbib/WLC_sbib.tab

echo "Finished clean ----------------------------- "

cd ${CURR_DIR}