/*
 * Combine multiple rrdFiles into one object
 * It implements the same interface, but changing the content
 * 
 * Part of the javascriptRRD package
 * Copyright (c) 2010 Igor Sfiligoi, isfiligoi@ucsd.edu
 *
 * Original repository: http://javascriptrrd.sourceforge.net/
 * 
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 */

// ============================================================
// RRD RRA handling class
function RRDRRASum(rra_list,offset_list,treat_undefined_as_zero) {
  this.rra_list=rra_list;
  this.offset_list=offset_list;
  this.treat_undefined_as_zero=treat_undefined_as_zero;
  this.row_cnt= this.rra_list[0].getNrRows();
}

RRDRRASum.prototype.getIdx = function() {
  return this.rra_list[0].getIdx();
}

// Get number of rows/columns
RRDRRASum.prototype.getNrRows = function() {
  return this.row_cnt;
}
RRDRRASum.prototype.getNrDSs = function() {
  return this.rra_list[0].getNrDSs();
}

// Get RRA step (expressed in seconds)
RRDRRASum.prototype.getStep = function() {
  return this.rra_list[0].getStep();
}

// Get consolidation function name
RRDRRASum.prototype.getCFName = function() {
  return this.rra_list[0].getCFName();
}

RRDRRASum.prototype.getEl = function(row_idx,ds_idx) {
  var outSum=0.0;
  for (var i in this.rra_list) {
    var offset=this.offset_list[i];
    if ((row_idx+offset)<this.row_cnt) {
      var rra=this.rra_list[i];
      val=rra.getEl(row_idx+offset,ds_idx);
    } else {
      /* out of row range -> undefined*/
      val=undefined;
    }
    /* treat all undefines as 0 for now */
    if (val==undefined) {
      if (this.treat_undefined_as_zero) {
  val=0;
      } else {
  /* if even one element is undefined, the whole sum is undefined */
  outSum=undefined;
  break;
      }
    }
    outSum+=val;
  }
  return outSum;
}

// Low precision version of getEl
// Uses getFastDoubleAt
RRDRRASum.prototype.getElFast = function(row_idx,ds_idx) {
  var outSum=0.0;
  for (var i in this.rra_list) {
    var offset=this.offset_list[i];
    if ((row_id+offset)<this.row_cnt) {
      var rra=this.rra_list[i];
      val=rra.getElFast(row_idx+offset,ds_idx);
    } else {
      /* out of row range -> undefined*/
      val=undefined;
    }
    /* treat all undefines as 0 for now */
    if (val==undefined) {
      if (this.treat_undefined_as_zero) {
  val=0;
      } else {
  /* if even one element is undefined, the whole sum is undefined */
  outSum=undefined;
  break;
      }
    }
    outSum+=val;
  }
  return outSum;
}

/*** INTERNAL ** sort by lastupdate, descending ***/

function rrdFileSort(f1, f2) {
  return f2.getLastUpdate()-f1.getLastUpdate();
}

/*
 * Sum several RRDfiles together
 * They must all have the same DSes and the same RRAs
 */ 

function RRDFileSum(file_list,treat_undefined_as_zero) {
  if (treat_undefined_as_zero==undefined) {
    this.treat_undefined_as_zero=true;
  } else {
    this.treat_undefined_as_zero=treat_undefined_as_zero;
  }
  this.file_list=file_list;
  this.file_list.sort();

  // ===================================
  // Start of user functions

  this.getMinStep = function() {
    return this.file_list[0].getMinStep();
  }
  this.getLastUpdate = function() {
    return this.file_list[0].getLastUpdate();
  }

  this.getNrDSs = function() {
    return this.file_list[0].getNrDSs();
  }

  this.getDSNames = function() {
    return this.file_list[0].getDSNames();
  }

  this.getDS = function(id) {
    return this.file_list[0].getDS(id);
  }

  this.getNrRRAs = function() {
    return this.file_list[0].getNrRRAs();
  }

  this.getRRAInfo = function(idx) {
    return this.file_list[0].getRRAInfo(idx);
  }

  this.getRRA = function(idx) {
    var rra_info=this.getRRAInfo(idx);
    var rra_step=rra_info.getStep();
    var realLastUpdate=undefined;

    var rra_list=new Array();
    var offset_list=new Array();
    for (var i in this.file_list) {
      file=file_list[i];
      fileLastUpdate=file.getLastUpdate();
      if (realLastUpdate!=undefined) {
  fileSkrew=Math.floor((realLastUpdate-fileLastUpdate)/rra_step);
      } else {
  fileSkrew=0;
  firstLastUpdate=fileLastUpdate;
      }
      offset_list.push(fileSkrew);
      fileRRA=file.getRRA(idx);
      rra_list.push(fileRRA);
    }

    return new RRDRRASum(rra_list,offset_list,this.treat_undefined_as_zero);
  }

}
