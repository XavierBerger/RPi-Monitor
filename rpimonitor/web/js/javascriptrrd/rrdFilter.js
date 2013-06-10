/*
 * Filter classes for rrdFile
 * They implement the same interface, but changing the content
 * 
 * Part of the javascriptRRD package
 * Copyright (c) 2009 Frank Wuerthwein, fkw@ucsd.edu
 *
 * Original repository: http://javascriptrrd.sourceforge.net/
 * 
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 */

/*
 * All filter classes must implement the following interface:
 *     getMinStep()
 *     getLastUpdate()
 *     getNrRRAs()
 *     getRRAInfo(rra_idx)
 *     getFilterRRA(rra_idx)
 *     getName()
 *
 * Where getFilterRRA returns an object implementing the following interface:
 *     getIdx()
 *     getNrRows()
 *     getStep()
 *     getCFName()
 *     getEl(row_idx)
 *     getElFast(row_idx)
 *
 */


// ================================================================
// Filter out a subset of DSs (identified either by idx or by name)

function RRDRRAFilterDS(rrd_rra,ds_list) {
  this.rrd_rra=rrd_rra;
  this.ds_list=ds_list;
}
RRDRRAFilterDS.prototype.getIdx = function() {return this.rrd_rra.getIdx();}
RRDRRAFilterDS.prototype.getNrRows = function() {return this.rrd_rra.getNrRows();}
RRDRRAFilterDS.prototype.getNrDSs = function() {return this.ds_list.length;}
RRDRRAFilterDS.prototype.getStep = function() {return this.rrd_rra.getStep();}
RRDRRAFilterDS.prototype.getCFName = function() {return this.rrd_rra.getCFName();}
RRDRRAFilterDS.prototype.getEl = function(row_idx,ds_idx) {
  if ((ds_idx>=0) && (ds_idx<this.ds_list.length)) {
    var real_ds_idx=this.ds_list[ds_idx].real_ds_idx;
    return this.rrd_rra.getEl(row_idx,real_ds_idx);
  } else {
    throw RangeError("DS idx ("+ ds_idx +") out of range [0-" + this.ds_list.length +").");
  }	
}
RRDRRAFilterDS.prototype.getElFast = function(row_idx,ds_idx) {
  if ((ds_idx>=0) && (ds_idx<this.ds_list.length)) {
    var real_ds_idx=this.ds_list[ds_idx].real_ds_idx;
    return this.rrd_rra.getElFast(row_idx,real_ds_idx);
  } else {
    throw RangeError("DS idx ("+ ds_idx +") out of range [0-" + this.ds_list.length +").");
  }	
}

// --------------------------------------------------
function RRDFilterDS(rrd_file,ds_id_list) {
  this.rrd_file=rrd_file;
  this.ds_list=[];
  for (var i=0; i<ds_id_list.length; i++) {
    var org_ds=rrd_file.getDS(ds_id_list[i]);
    // must create a new copy, as the index has changed
    var new_ds=new RRDDS(org_ds.rrd_data,org_ds.rrd_data_idx,i);
    // then extend it to include the real RRD index
    new_ds.real_ds_idx=org_ds.my_idx;

    this.ds_list.push(new_ds);
  }
}
RRDFilterDS.prototype.getMinStep = function() {return this.rrd_file.getMinStep();}
RRDFilterDS.prototype.getLastUpdate = function() {return this.rrd_file.getLastUpdate();}

RRDFilterDS.prototype.getNrDSs = function() {return this.ds_list.length;}
RRDFilterDS.prototype.getDSNames = function() {
  var ds_names=[];
  for (var i=0; i<this.ds_list.length; i++) {
    ds_names.push(ds_list[i].getName());
  }
  return ds_names;
}
RRDFilterDS.prototype.getDS = function(id) {
  if (typeof id == "number") {
    return this.getDSbyIdx(id);
  } else {
    return this.getDSbyName(id);
  }
}

// INTERNAL: Do not call directly
RRDFilterDS.prototype.getDSbyIdx = function(idx) {
  if ((idx>=0) && (idx<this.ds_list.length)) {
    return this.ds_list[idx];
  } else {
    throw RangeError("DS idx ("+ idx +") out of range [0-" + this.ds_list.length +").");
  }	
}

// INTERNAL: Do not call directly
RRDFilterDS.prototype.getDSbyName = function(name) {
  for (var idx=0; idx<this.ds_list.length; idx++) {
    var ds=this.ds_list[idx];
    var ds_name=ds.getName()
    if (ds_name==name)
      return ds;
  }
  throw RangeError("DS name "+ name +" unknown.");
}

RRDFilterDS.prototype.getNrRRAs = function() {return this.rrd_file.getNrRRAs();}
RRDFilterDS.prototype.getRRAInfo = function(idx) {return this.rrd_file.getRRAInfo(idx);}
RRDFilterDS.prototype.getRRA = function(idx) {return new RRDRRAFilterDS(this.rrd_file.getRRA(idx),this.ds_list);}

// ================================================================
// Filter out by using a user provided filter object
// The object must implement the following interface
//   getName()               - Symbolic name give to this function
//   getDSName()             - list of DSs used in computing the result (names or indexes)
//   computeResult(val_list) - val_list contains the values of the requested DSs (in the same order) 

// Example class that implements the interface:
//   function DoNothing(ds_name) { //Leaves the DS alone.
//     this.getName = function() {return ds_name;}
//     this.getDSNames = function() {return [ds1_name];}
//     this.computeResult = function(val_list) {return val_list[0];}
//   }
//   function sumDS(ds1_name,ds2_name) { //Sums the two DSs.
//     this.getName = function() {return ds1_name+"+"+ds2_name;}
//     this.getDSNames = function() {return [ds1_name,ds2_name];}
//     this.computeResult = function(val_list) {return val_list[0]+val_list[1];}
//   }
//
// So to add a summed DS of your 1st and second DS: 
// var ds0_name = rrd_data.getDS(0).getName();
// var ds1_name = rrd_data.getDS(1).getName();
// rrd_data = new RRDFilterOp(rrd_data, [new DoNothing(ds0_name), 
//                DoNothing(ds1_name), sumDS(ds0_name, ds1_name]);
////////////////////////////////////////////////////////////////////

//Private
function RRDDSFilterOp(rrd_file,op_obj,my_idx) {
  this.rrd_file=rrd_file;
  this.op_obj=op_obj;
  this.my_idx=my_idx;
  var ds_names=op_obj.getDSNames();
  var ds_idx_list=[];
  for (var i=0; i<ds_names.length; i++) {
    ds_idx_list.push(rrd_file.getDS(ds_names[i]).getIdx());
  }
  this.ds_idx_list=ds_idx_list;
}
RRDDSFilterOp.prototype.getIdx = function() {return this.my_idx;}
RRDDSFilterOp.prototype.getName = function() {return this.op_obj.getName();}

RRDDSFilterOp.prototype.getType = function() {return "function";}
RRDDSFilterOp.prototype.getMin = function() {return undefined;}
RRDDSFilterOp.prototype.getMax = function() {return undefined;}

// These are new to RRDDSFilterOp
RRDDSFilterOp.prototype.getRealDSList = function() { return this.ds_idx_list;}
RRDDSFilterOp.prototype.computeResult = function(val_list) {return this.op_obj.computeResult(val_list);}

// ------ --------------------------------------------
//Private
function RRDRRAFilterOp(rrd_rra,ds_list) {
  this.rrd_rra=rrd_rra;
  this.ds_list=ds_list;
}
RRDRRAFilterOp.prototype.getIdx = function() {return this.rrd_rra.getIdx();}
RRDRRAFilterOp.prototype.getNrRows = function() {return this.rrd_rra.getNrRows();}
RRDRRAFilterOp.prototype.getNrDSs = function() {return this.ds_list.length;}
RRDRRAFilterOp.prototype.getStep = function() {return this.rrd_rra.getStep();}
RRDRRAFilterOp.prototype.getCFName = function() {return this.rrd_rra.getCFName();}
RRDRRAFilterOp.prototype.getEl = function(row_idx,ds_idx) {
  if ((ds_idx>=0) && (ds_idx<this.ds_list.length)) {
    var ds_idx_list=this.ds_list[ds_idx].getRealDSList();
    var val_list=[];
    for (var i=0; i<ds_idx_list.length; i++) {
      val_list.push(this.rrd_rra.getEl(row_idx,ds_idx_list[i]));
    }
    return this.ds_list[ds_idx].computeResult(val_list);
  } else {
    throw RangeError("DS idx ("+ ds_idx +") out of range [0-" + this.ds_list.length +").");
  }	
}
RRDRRAFilterOp.prototype.getElFast = function(row_idx,ds_idx) {
  if ((ds_idx>=0) && (ds_idx<this.ds_list.length)) {
    var ds_idx_list=this.ds_list[ds_idx].getRealDSList();
    var val_list=[];
    for (var i=0; i<ds_idx_list.length; i++) {
      val_list.push(this.rrd_rra.getEl(row_idx,ds_idx_list[i]));
    }
    return this.ds_list[ds_idx].computeResult(val_list);
  } else {
    throw RangeError("DS idx ("+ ds_idx +") out of range [0-" + this.ds_list.length +").");
  }	
}

// --------------------------------------------------
//Public
function RRDFilterOp(rrd_file,op_obj_list) {
  this.rrd_file=rrd_file;
  this.ds_list=[];
  for (var i=0; i<op_obj_list.length; i++) {
    this.ds_list.push(new RRDDSFilterOp(rrd_file,op_obj_list[i],i));
  }
}
RRDFilterOp.prototype.getMinStep = function() {return this.rrd_file.getMinStep();}
RRDFilterOp.prototype.getLastUpdate = function() {return this.rrd_file.getLastUpdate();}
RRDFilterOp.prototype.getNrDSs = function() {return this.ds_list.length;}
RRDFilterOp.prototype.getDSNames = function() {
  var ds_names=[];
  for (var i=0; i<this.ds_list.length; i++) {
    ds_names.push(ds_list[i].getName());
  }
  return ds_names;
}
RRDFilterOp.prototype.getDS = function(id) {
  if (typeof id == "number") {
    return this.getDSbyIdx(id);
  } else {
    return this.getDSbyName(id);
  }
}

// INTERNAL: Do not call directly
RRDFilterOp.prototype.getDSbyIdx = function(idx) {
  if ((idx>=0) && (idx<this.ds_list.length)) {
    return this.ds_list[idx];
  } else {
    throw RangeError("DS idx ("+ idx +") out of range [0-" + this.ds_list.length +").");
  }	
}

// INTERNAL: Do not call directly
RRDFilterOp.prototype.getDSbyName = function(name) {
  for (var idx=0; idx<this.ds_list.length; idx++) {
    var ds=this.ds_list[idx];
    var ds_name=ds.getName()
    if (ds_name==name)
      return ds;
  }
  throw RangeError("DS name "+ name +" unknown.");
}

RRDFilterOp.prototype.getNrRRAs = function() {return this.rrd_file.getNrRRAs();}
RRDFilterOp.prototype.getRRAInfo = function(idx) {return this.rrd_file.getRRAInfo(idx);}
RRDFilterOp.prototype.getRRA = function(idx) {return new RRDRRAFilterOp(this.rrd_file.getRRA(idx),this.ds_list);}

// ================================================================
// Shift RRAs in rra_list by the integer shift_int (in seconds).
// Only change is getLastUpdate - this takes care of everything.
// Example: To shift the first three 3 RRAs in the file by one hour, 
//         rrd_data = new RRAFilterShift(rra_data, 3600, [0,1,2]);

function RRAFilterShift(rrd_file, shift_int, rra_list) {
  this.rrd_file = rrd_file;
  this.shift_int = shift_int;
  this.rra_list = rra_list;
  this.shift_in_seconds = this.shift_int*3600; //number of steps needed to move 1 hour
}
RRAFilterShift.prototype.getMinStep = function() {return this.rrd_file.getMinStep();}
RRAFilterShift.prototype.getLastUpdate = function() {return this.rrd_file.getLastUpdate()+this.shift_in_seconds;}
RRAFilterShift.prototype.getNrDSs = function() {return this.rrd_file.getNrDSs();}
RRAFilterShift.prototype.getDSNames = function() {return this.rrd_file.getDSNames();}
RRAFilterShift.prototype.getDS = function(id) {return this.rrd_file.getDS(id);}
RRAFilterShift.prototype.getNrRRAs = function() {return this.rra_list.length;}
RRAFilterShift.prototype.getRRAInfo = function(idx) {return this.rrd_file.getRRAInfo(idx);}
RRAFilterShift.prototype.getRRA = function(idx) {return this.rrd_file.getRRA(idx);}

// ================================================================
// Filter RRAs by using a user provided filter object
// The object must implement the following interface
//   getIdx()               - Index of RRA to use
//   getStep()              - new step size (return null to use step size of RRA specified by getIdx() 

/* Example classes that implements the interface:
*
*      //This RRA Filter object leaves the original RRA unchanged.
*
*      function RRADoNothing(rra_idx) {
*         this.getIdx = function() {return rra_idx;}
*         this.getStep = function() {return null;} 
*      }
*      
*      // This Filter creates a new RRA with a different step size 
*      // based on another RRA, whose data the new RRA averages. 
*      // rra_idx should be index of RRA with largest step size 
*      // that doesn't exceed new step size.  
*
*      function RRA_Avg(rra_idx,new_step_in_seconds) {
*         this.getIdx = function() {return rra_idx;}
*         this.getStep = function() {return new_step_in_seconds;}
*      }
*      //For example, if you have two RRAs, one with a 5 second step,
*      //and another with a 60 second step, and you'd like a 30 second step,
*      //rrd_data = new RRDRRAFilterShift(rrd_data,[new RRADoNothing(0), new RRDDoNothing(1),new RRA_Avg(1,30)];)
*/

//Private Function
function RRAInfoFilterAvg(rrd_file, rra, op_obj, idx) {
  this.rrd_file = rrd_file;
  this.op_obj = op_obj;
  this.base_rra = rrd_file.getRRA(this.op_obj.getIdx());
  this.rra = rra;
  this.idx = idx;
  var scaler = 1;
  if (this.op_obj.getStep()!=null) {scaler = this.op_obj.getStep()/this.base_rra.getStep();}
  this.scaler = scaler;
}
RRAInfoFilterAvg.prototype.getIdx = function() {return this.idx;}
RRAInfoFilterAvg.prototype.getNrRows = function() {return this.rra.getNrRows();} //draw info from RRAFilterAvg
RRAInfoFilterAvg.prototype.getStep = function() {return this.rra.getStep();}
RRAInfoFilterAvg.prototype.getCFName = function() {return this.rra.getCFName();}
RRAInfoFilterAvg.prototype.getPdpPerRow = function() {return this.rrd_file.getRRAInfo(this.op_obj.getIdx()).getPdpPerRow()*this.scaler;}

//---------------------------------------------------------------------------
//Private Function
function RRAFilterAvg(rrd_file, op_obj) {
  this.rrd_file = rrd_file;
  this.op_obj = op_obj;
  this.base_rra = rrd_file.getRRA(op_obj.getIdx());
  var scaler=1; 
  if (op_obj.getStep()!=null) {scaler = op_obj.getStep()/this.base_rra.getStep();}
  this.scaler = Math.floor(scaler);
  //document.write(this.scaler+",");
}
RRAFilterAvg.prototype.getIdx = function() {return this.op_obj.getIdx();}
RRAFilterAvg.prototype.getCFName = function() {return this.base_rra.getCFName();}
RRAFilterAvg.prototype.getNrRows = function() {return Math.floor(this.base_rra.getNrRows()/this.scaler);}
RRAFilterAvg.prototype.getNrDSs = function() {return this.base_rra.getNrDSs();}
RRAFilterAvg.prototype.getStep = function() {
   if(this.op_obj.getStep()!=null) {
      return this.op_obj.getStep(); 
   } else { return this.base_rra.getStep();}
}
RRAFilterAvg.prototype.getEl = function(row,ds) {
   var sum=0;
   for(var i=0;i<this.scaler;i++) {
      sum += this.base_rra.getEl((this.scaler*row)+i,ds);
   }
   return sum/this.scaler;
}
RRAFilterAvg.prototype.getElFast = function(row,ds) {
   var sum=0;
   for(var i=0;i<this.scaler;i++) {
      sum += this.base_rra.getElFast((this.scaler*row)+i,ds);
   }
   return sum/this.scaler;
}

//----------------------------------------------------------------------------
//Public function - use this one for RRA averaging
function RRDRRAFilterAvg(rrd_file, op_obj_list) {
  this.rrd_file = rrd_file;
  this.op_obj_list = op_obj_list;
  this.rra_list=[];
  for (var i=0; i<op_obj_list.length; i++) {
    this.rra_list.push(new RRAFilterAvg(rrd_file,op_obj_list[i]));
  }
}
RRDRRAFilterAvg.prototype.getMinStep = function() {return this.rrd_file.getMinStep();} //other RRA steps change, not min
RRDRRAFilterAvg.prototype.getLastUpdate = function() {return this.rrd_file.getLastUpdate();}
RRDRRAFilterAvg.prototype.getNrDSs = function() {return this.rrd_file.getNrDSs();} //DSs unchanged
RRDRRAFilterAvg.prototype.getDSNames = function() {return this.rrd_file.getDSNames();}
RRDRRAFilterAvg.prototype.getDS = function(id) {return this.rrd_file.getDS(id);}
RRDRRAFilterAvg.prototype.getNrRRAs = function() {return this.rra_list.length;} 
RRDRRAFilterAvg.prototype.getRRAInfo = function(idx) {
  if ((idx>=0) && (idx<this.rra_list.length)) {
    return new RRAInfoFilterAvg(this.rrd_file, this.rra_list[idx],this.op_obj_list[idx],idx); 
  } else {return this.rrd_file.getRRAInfo(0);}
}
RRDRRAFilterAvg.prototype.getRRA = function(idx) {
  if ((idx>=0) && (idx<this.rra_list.length)) {
    return this.rra_list[idx];
  }
}
