import HiredTask from "../models/hiredTask.model.js";
import Service from "../models/service.moel.js";
import Report from '../models/Report.model.js';
import Category from "../models/category.model.js";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";




export const getAllCounts = async (req, res, next) => {
    try {
        const allReport = await Report.countDocuments({
 
        });
        const allCategories = await Category.countDocuments({
 
        });
        const allUsers = await User.countDocuments({
    
        });
        const allEnableUsers = await User.countDocuments({
            enable:true
        });
        const allDisableUsers = await User.countDocuments({
            enable:false
        });
        const allServicesCount = await Service.countDocuments({
    
        });
      const allHiredServicesCount = await HiredTask.countDocuments({
    
      });
      const PendingServicesCount = await HiredTask.countDocuments({
 status: 'pending' 
      });
      const ProcessingServicesCount = await HiredTask.countDocuments({
        status: 'processing'   });
      const AcceptedServicesCount = await HiredTask.countDocuments({
        status: 'Accepted'       });
      const DoneServicesCount = await HiredTask.countDocuments({
        status: 'done'      });
  
      res.status(200).json({
        allServicesCount,
        PendingServicesCount,
        ProcessingServicesCount,
        AcceptedServicesCount,
        DoneServicesCount,
        allHiredServicesCount,
        allCategories,
        allReport,
allUsers
      });
    } catch (err) {
      next(err);
    }
  };
  