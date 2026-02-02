
# the standard shell for make

BASE_DIR = $(shell pwd)

TXT_DIR = $(BASE_DIR)/txt_tabs
BIB_DIR = $(BASE_DIR)/bib_tabs
JSBIB_DIR = $(BASE_DIR)/js_bib
JSSBIB_DIR = $(BASE_DIR)/js_sbib
JSSCODS_DIR = $(BASE_DIR)/js_scods

BASH=bash

CRI_BIB_1 = \
$(JSBIB_DIR)/ALE_BIB.js 

CRI_SBIB_1 = \
$(JSSBIB_DIR)/ALE_SBIB.js 

CRI_SCOD_1 = \
$(JSSCODS_DIR)/ALE_SVERSES.js 

CRI_BIB = \
$(JSBIB_DIR)/ALE_BIB.js \
$(JSBIB_DIR)/BYZ_BIB.js \
$(JSBIB_DIR)/LXX_BIB.js \
$(JSBIB_DIR)/NES_BIB.js \
$(JSBIB_DIR)/TKH_BIB.js \
$(JSBIB_DIR)/TR_BIB.js \
$(JSBIB_DIR)/WH_BIB.js \
$(JSBIB_DIR)/WLC_BIB.js


CRI_SBIB = \
$(JSSBIB_DIR)/ALE_SBIB.js \
$(JSSBIB_DIR)/BYZ_SBIB.js \
$(JSSBIB_DIR)/LXX_SBIB.js \
$(JSSBIB_DIR)/NES_SBIB.js \
$(JSSBIB_DIR)/TKH_SBIB.js \
$(JSSBIB_DIR)/TR_SBIB.js \
$(JSSBIB_DIR)/WH_SBIB.js \
$(JSSBIB_DIR)/WLC_SBIB.js \


CRI_SCOD = \
$(JSSCODS_DIR)/ALE_SVERSES.js \
$(JSSCODS_DIR)/BYZ_SVERSES.js \
$(JSSCODS_DIR)/LXX_SVERSES.js \
$(JSSCODS_DIR)/NES_SVERSES.js \
$(JSSCODS_DIR)/TKH_SVERSES.js \
$(JSSCODS_DIR)/TR_SVERSES.js \
$(JSSCODS_DIR)/WH_SVERSES.js \
$(JSSCODS_DIR)/WLC_SVERSES.js


# Suppresses display of executed commands
# $(VERBOSE).SILENT:

default_rule: $(CRI_BIB) $(CRI_SBIB) $(CRI_SCOD) 
	@echo "Finished building all critical js files."

	
#---------------------------------------------------------
# clean rule
#

#clean: 
#	rm -f $(BIN_DIR)/$(EXE_NAM) $(ALL_OBJS)


#full: clean $(BIN_DIR)/$(EXE_NAM)
#	@echo "Finished full build of "$(EXE_NAM)"."


# Rules to build .o files from their sources:


#---------------------------------------------------------
# GENERATING RULES
#

# ALE

$(BIB_DIR)/ALE_bib.tab: $(TXT_DIR)/ALE_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh ALE


$(JSBIB_DIR)/ALE_BIB.js: $(BIB_DIR)/ALE_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh ALE $(BIB_DIR)
	

$(JSSBIB_DIR)/ALE_SBIB.js: $(TXT_DIR)/ALE_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh ALE


$(JSSCODS_DIR)/ALE_SVERSES.js: $(TXT_DIR)/ALE_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh ALE


# BYZ

$(BIB_DIR)/BYZ_bib.tab: $(TXT_DIR)/BYZ_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh BYZ


$(JSBIB_DIR)/BYZ_BIB.js: $(BIB_DIR)/BYZ_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh BYZ $(BIB_DIR)
	

$(JSSBIB_DIR)/BYZ_SBIB.js: $(TXT_DIR)/BYZ_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh BYZ


$(JSSCODS_DIR)/BYZ_SVERSES.js: $(TXT_DIR)/BYZ_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh BYZ


# LXX

$(BIB_DIR)/LXX_bib.tab: $(TXT_DIR)/LXX_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh LXX


$(JSBIB_DIR)/LXX_BIB.js: $(BIB_DIR)/LXX_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh LXX $(BIB_DIR)
	

$(JSSBIB_DIR)/LXX_SBIB.js: $(TXT_DIR)/LXX_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh LXX


$(JSSCODS_DIR)/LXX_SVERSES.js: $(TXT_DIR)/LXX_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh LXX


# NES

$(BIB_DIR)/NES_bib.tab: $(TXT_DIR)/NES_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh NES


$(JSBIB_DIR)/NES_BIB.js: $(BIB_DIR)/NES_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh NES $(BIB_DIR)
	

$(JSSBIB_DIR)/NES_SBIB.js: $(TXT_DIR)/NES_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh NES


$(JSSCODS_DIR)/NES_SVERSES.js: $(TXT_DIR)/NES_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh NES


# TKH

$(BIB_DIR)/TKH_bib.tab: $(TXT_DIR)/TKH_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh TKH


$(JSBIB_DIR)/TKH_BIB.js: $(BIB_DIR)/TKH_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh TKH $(BIB_DIR)
	

$(JSSBIB_DIR)/TKH_SBIB.js: $(TXT_DIR)/TKH_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh TKH


$(JSSCODS_DIR)/TKH_SVERSES.js: $(TXT_DIR)/TKH_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh TKH


# TR

$(BIB_DIR)/TR_bib.tab: $(TXT_DIR)/TR_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh TR


$(JSBIB_DIR)/TR_BIB.js: $(BIB_DIR)/TR_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh TR $(BIB_DIR)
	

$(JSSBIB_DIR)/TR_SBIB.js: $(TXT_DIR)/TR_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh TR


$(JSSCODS_DIR)/TR_SVERSES.js: $(TXT_DIR)/TR_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh TR


# WH

$(BIB_DIR)/WH_bib.tab: $(TXT_DIR)/WH_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh WH


$(JSBIB_DIR)/WH_BIB.js: $(BIB_DIR)/WH_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh WH $(BIB_DIR)
	

$(JSSBIB_DIR)/WH_SBIB.js: $(TXT_DIR)/WH_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh WH


$(JSSCODS_DIR)/WH_SVERSES.js: $(TXT_DIR)/WH_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh WH


# WLC

$(BIB_DIR)/WLC_bib.tab: $(TXT_DIR)/WLC_txt.tab
	$(BASH) $(BIB_DIR)/gen_bib_tab_sh WLC


$(JSBIB_DIR)/WLC_BIB.js: $(BIB_DIR)/WLC_bib.tab
	$(BASH) $(JSBIB_DIR)/gen_one_file_js_bib_sh WLC $(BIB_DIR)
	

$(JSSBIB_DIR)/WLC_SBIB.js: $(TXT_DIR)/WLC_txt.tab
	$(BASH) $(JSSBIB_DIR)/gen_js_sbib_sh WLC


$(JSSCODS_DIR)/WLC_SVERSES.js: $(TXT_DIR)/WLC_txt.tab
	$(BASH) $(JSSCODS_DIR)/gen_js_svers_sh WLC



