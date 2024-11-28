var express = require('express');
var router = express.Router();
//Thêm model
const Product = require("../models/product");
const Suppliers = require("../models/suppliers");
const Upload = require('../config/common/upload')
const Sizes = require('../models/sizes')
const Evaluate = require('../models/evaluate')
const Favourite = require('../models/favourite')
const Cart = require('../models/cart')
const Order = require('../models/order')
const Typeproducts = require('../models/typeproducts')
const Vouchers = require('../models/vouchers');
const suppliers = require('../models/suppliers');
//Thêm nhà cung cấp
router.post('/add-supplier', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/upload/${file.filename}`;
    const newSuppliers = new Suppliers({
      name: data.name,
      phone: data.phone,
      email: data.email,
      description: data.description,
      image: urlsImage,
    })
    const result = await newSuppliers.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm nhà cung cấp thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
  }
});
// xoá nhà cung cấp
router.delete("/delete-supplier-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Suppliers.findByIdAndDelete(id);
    if (result) {
      res.json({
        status: 200,
        messenger: "Xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "tìm và xóa thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//update nhà cung cấp
router.put('/update-supplier/:id', Upload.single('image'), async (req, res) => {
  try {
    const supplierId = req.params.id;
    const data = req.body;
    const { file } = req;

    // Lấy thông tin nhà cung cấp hiện tại từ DB theo id
    const supplier = await Suppliers.findById(supplierId);
    if (!supplier) {
      return res.json({
        "status": 404,
        "message": "Nhà cung cấp không tồn tại"
      });
    }

    // Nếu có file ảnh mới thì cập nhật, không thì giữ ảnh cũ
    let urlsImage = supplier.image; // Giữ ảnh cũ nếu không có ảnh mới
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/upload/${file.filename}`;
    }

    // Cập nhật các trường của nhà cung cấp
    supplier.name = data.name || supplier.name;
    supplier.phone = data.phone || supplier.phone;
    supplier.email = data.email || supplier.email;
    supplier.description = data.description || supplier.description;
    supplier.image = urlsImage;

    const result = await supplier.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật nhà cung cấp thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
//lấy danh sách nhà cung cấp
router.get('/suppliers', async (req, res) => {
  try {
    const suppliersList = await Suppliers.find().sort({ createdAt: -1 });
    if (suppliersList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách nhà cung cấp thành công",
        "data": suppliersList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có nhà cung cấp nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
//tìm kiếm nhà cung cấp
router.get('/get-supplier-by-name', async (req, res) => {
  try {
    const name = req.query.name
    const data = await Suppliers.find({ name: { "$regex": name, "$options": "i" } }).sort({ createdAt: -1 })
    res.json({
      "status": 200,
      "messenger": "Tìm kiếm thành công",
      "data": data
    })
  } catch (error) {
    console.log(error)
  }
})

/* Sản phẩm*/
//tìm kiếm sản phẩm
router.get('/get-product-by-name', async (req, res) => {
  try {
    const product_name = req.query.product_name
    const data = await Product.find({ product_name: { "$regex": product_name, "$options": "i" } }).sort({ createdAt: -1 })
    res.json({
      "status": 200,
      "messenger": "Tìm kiếm thành công",
      "data": data
    })
  } catch (error) {
    console.log(error)
  }
})
// Thêm sản phẩm 1 anh
// router.post('/add-product', Upload.single('image'), async (req, res) => {
//   try {
//     const data = req.body;
//     const { file } = req
//     const urlsImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
//     const newProduct = new Product({
//       image: urlsImage,
//       quantity: data.quantity,
//       price: data.price,
//       description: data.description,
//       product_name: data.product_name,
//       state: data.state,
//       id_producttype: data.id_producttype,
//       id_suppliers: data.id_suppliers,
//     })
//     const result = await newProduct.save();
//     if (result) {
//       res.json({
//         "status": 200,
//         "message": "Thêm sản phẩm thành công",
//         "data": result
//       });
//     } else {
//       res.json({
//         "status": 400,
//         "message": "Thất bại",
//         "data": []
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
//Thêm sản phẩm nhiều ảnh
router.post('/add-product', Upload.array('image', 5), async (req, res) => {
  // Upload.array('image', 5) => up nhiều file tối đa là 5 abc
  try {
    const data = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        "status": 400,
        "message": "Không có file nào được tải lên"
      });
    }

    // Tạo mảng URLs từ các file đã tải lên
    const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/upload/${file.filename}`);

    let sizeQuantities = [];
    if (data.sizeQuantities) {
      try {
        sizeQuantities = JSON.parse(data.sizeQuantities).map((sizeQuantity) => ({
          sizeId: sizeQuantity.sizeId,
          quantity: sizeQuantity.quantity
        }));
      } catch (error) {
        return res.status(400).json({
          status: 400,
          message: "Định dạng sizeQuantities không hợp lệ"
        });
      }
    }
    const newProduct = new Product({
      image: urlsImage,
      quantity: data.quantity,
      price: data.price,
      description: data.description,
      product_name: data.product_name,
      state: data.state,
      id_producttype: data.id_producttype,
      id_suppliers: data.id_suppliers,
      sizeQuantities: sizeQuantities,
    });

    const result = await newProduct.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm sản phẩm thành công",
        "data": result
      });
    } else {
      res.status(400).json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi máy chủ",
      "error": err.message,
      "stack": err.stack
    });
  }
});

//sửa sản phẩm
router.put('/update-product/:id', Upload.array('image', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const files = req.files;

    // Tìm sản phẩm theo ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Sản phẩm không tồn tại"
      });
    }

    // Nếu có file ảnh mới thì cập nhật
    let urlsImage = product.image || []; // Lấy ảnh cũ
    if (files && files.length > 0) {
      urlsImage = files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    }

    // Cập nhật các trường
    product.product_name = data.product_name || product.product_name;
    product.price = data.price || product.price;
    product.state = data.state || product.state;
    product.description = data.description || product.description;
    product.quantity = data.quantity || product.quantity;
    product.image = urlsImage;
    product.id_producttype = data.id_producttype || product.id_producttype;
    product.id_suppliers = data.id_suppliers || product.id_suppliers;

    // Cập nhật sizeQuantities nếu có
    if (data.sizeQuantities) {
      try {
        product.sizeQuantities = JSON.parse(data.sizeQuantities);
      } catch (err) {
        return res.status(400).json({
          status: 400,
          message: "sizeQuantities không đúng định dạng JSON"
        });
      }
    }

    // Lưu thay đổi
    const result = await product.save();
    res.json({
      status: 200,
      message: "Cập nhật sản phẩm thành công",
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
    });
  }
});
// danh sách sản phẩm
router.get('/prodct', async (req, res) => {
  try {
    const productList = await Product.find().sort({ createdAt: -1 });
    if (productList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách sản phẩm thành công",
        "data": productList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có sản phẩm nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
// lấy thông tin sản phẩm theo ID
router.get('/get_product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('id_suppliers', 'name')
      .populate('id_producttype', 'name')
      .populate({
        path: 'sizeQuantities.sizeId',  // Populate sizeId trong sizeQuantities
        select: 'name'  // Chỉ lấy trường name của size
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//* Size
//thêm size
router.post('/add-size', async (req, res) => {
  try {
    const data = req.body;
    const newSizes = new Sizes({
      name: data.name
    });
    const result = await newSizes.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm size thành công",
        data: result
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Thất bại",
        "data": []
      });
    }
  } catch (error) {
    console.error(error);
  }
});
// danh sách size
router.get("/get-list-size", async (req, res) => {
  try {
    const data = await Sizes.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});


//** loại sản phẩm */
// thêm loại
router.post('/add-type', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req;
    const urlsImage = `${req.protocol}://${req.get("host")}/upload/${file.filename}`;

    // Giả sử bạn gửi một chuỗi chứa các ID kích thước, phân cách bằng dấu phẩy
    const sizesArray = data.id_size.split(',').map(id => id.trim()); // Chia chuỗi thành mảng và loại bỏ khoảng trắng

    const newTypeproducts = new Typeproducts({
      name: data.name,
      image: urlsImage,
      id_size: sizesArray
    });

    const result = await newTypeproducts.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


// danh sách loại sản phẩm
router.get('/typeproduct', async (req, res) => {
  try {
    const TypeproductsList = await Typeproducts.find()
      .populate('id_size', 'name')  // Phân giải kích thước
      .sort({ createdAt: 1 });
    console.log("TypeproductsList:", TypeproductsList)
    if (TypeproductsList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách thành công",
        "data": TypeproductsList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có danh sách nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});

// xóa loại sản phẩm
router.delete("/delete-typeproduct-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Typeproducts.findByIdAndDelete(id);
    if (result) {
      res.json({
        status: 200,
        messenger: "Xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "tìm và xóa thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//sửa loại sản phẩm
router.put('/update-typeproduct/:id', Upload.single('image'), async (req, res) => {
  try {
    const typeID = req.params.id;
    const data = req.body;
    const { file } = req;

    // Tìm loại sản phẩm theo ID
    const typeproduct = await Typeproducts.findById(typeID);
    if (!typeproduct) {
      return res.status(404).json({
        "status": 404,
        "message": "Không tồn tại loại sản phẩm"
      });
    }

    // Giữ nguyên đường dẫn hình ảnh cũ nếu không có hình ảnh mới
    let urlsImage = typeproduct.image;
    if (file) {
      urlsImage = `${req.protocol}://${req.get("host")}/upload/${file.filename}`;
    }

    // Cập nhật các trường của loại sản phẩm
    typeproduct.name = data.name || typeproduct.name;
    typeproduct.id_size = data.id_size ? data.id_size.split(',').map(id => id.trim()) : typeproduct.id_size;
    typeproduct.image = urlsImage;

    // Lưu lại các thay đổi
    const result = await typeproduct.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Cập nhật thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
//**voucher */
// thêm voucher
router.post('/add-voucher', Upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req
    const urlsImage = `${req.protocol}://${req.get("host")}/upload/${file.filename}`;

    const newVouchers = new Vouchers({
      name: data.name,
      image: urlsImage,
      description: data.description,  // Mô tả về voucher
      discountValue: data.discountValue,  // Giá trị giảm giá
      discountType: data.discountType,  // Loại giảm giá (percent hoặc fixed)
      validFrom: data.validFrom,  // Ngày bắt đầu hiệu lực
      validUntil: data.validUntil,  // Ngày hết hạn
      minimumOrderValue: data.minimumOrderValue,// Giá tối thiểu
    })
    const result = await newVouchers.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm thành công",

        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
  }
});
// dánh sách voucher
router.get("/get-list-voucher", async (req, res) => {
  try {
    const data = await Vouchers.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// sửa vouher
router.put('/update-voucher/:id', Upload.single('image'), async (req, res) => {
  try {
    const voucherId = req.params.id;
    const data = req.body;
    let urlsImage;


    if (req.file) {
      urlsImage = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
    } else {
      // Giữ lại đường dẫn ảnh cũ
      const existingVoucher = await Vouchers.findById(voucherId);
      if (!existingVoucher) {
        return res.status(404).json({
          "status": 404,
          "message": "Voucher không tồn tại",
        });
      }
      urlsImage = existingVoucher.image;
    }

    // Cập nhật thông tin voucher
    const updatedVoucher = await Vouchers.findByIdAndUpdate(
      voucherId,
      {
        name: data.name,
        image: urlsImage,
        description: data.description,
        discountValue: data.discountValue,
        discountType: data.discountType,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        minimumOrderValue: data.minimumOrderValue,
      },
      { new: true }
    );

    if (updatedVoucher) {
      res.json({
        "status": 200,
        "message": "Cập nhật thành công",
        "data": updatedVoucher,
      });
    } else {
      res.json({
        "status": 400,
        "message": "Cập nhật thất bại",
        "data": [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Có lỗi xảy ra",
    });
  }
});

/* API evaluate*/
// Thêm yêu thích
router.post('/add-favourite', async (req, res) => {
  try {
    const { userId, productId } = req.body; // Lấy dữ liệu từ yêu cầu

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !productId) {
      return res.status(400).json({
        status: 400,
        message: "Thiếu thông tin userId hoặc productId",
      });
    }

    // Kiểm tra xem đã có danh sách yêu thích của user chưa
    let favourite = await Favourite.findOne({ userId });

    if (!favourite) {
      // Tạo mới nếu không tồn tại
      favourite = new Favourite({
        userId,
        products: [{ productId }],
      });
    } else {
      // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách yêu thích
      const isProductExists = favourite.products.some(
        (item) => item.productId.toString() === productId
      );
      if (isProductExists) {
        return res.status(400).json({
          status: 400,
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }

      // Thêm sản phẩm mới vào danh sách
      favourite.products.push({ productId });
    }

    // Lưu dữ liệu
    const result = await favourite.save();

    res.json({
      status: 200,
      message: "Thêm vào danh sách yêu thích thành công",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
    });
  }
});



// xoá danh sách yêu thích
router.post("/remove-favourite", async (req, res) => {
  const { userId, productId } = req.body; // userId: ID người dùng, productId: ID sản phẩm cần xóa

  // Kiểm tra thông tin đầu vào
  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tìm danh sách yêu thích của người dùng
    const favourite = await Favourite.findOne({ userId });
    if (!favourite) {
      return res.status(404).json({ message: "Favourite list not found" });
    }

    // Tìm vị trí của sản phẩm trong danh sách yêu thích
    const productIndex = favourite.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in favourite list" });
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    favourite.products.splice(productIndex, 1);

    // Lưu danh sách yêu thích đã cập nhật
    await favourite.save();

    res.status(200).json({
      status: 200,
      message: "Product removed from favourite list successfully",
      data: favourite,
    });
  } catch (err) {
    console.error("Error removing product from favourite list:", err);
    res.status(500).json({ message: err.message });
  }
});

//lấy danh sách yêu thích
router.get("/get-favourite/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm danh sách yêu thích của người dùng và populate thông tin sản phẩm và size
    const favourite = await Favourite.findOne({ userId })
      .populate('products.productId', 'product_name price image description sizeQuantities id_producttype') // Lấy thông tin sản phẩm
    if (!favourite) {
      return res.status(404).json({ message: 'Favourite list not found' });
    }

    // Trả về danh sách sản phẩm yêu thích
    res.status(200).json({
      status: 200,
      message: "Get favourite successfully",
      data: {
        userId: favourite.userId,
        products: favourite.products,  // Lấy tất cả sản phẩm yêu thích và hiển thị thông tin size
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Đánh giá sản phẩm */
// Thêm đánh giá 
router.post('/add-evaluate', async (req, res) => {
  try {
    const data = req.body;
    const newEvaluate = new Evaluate({
      id_product: data.id_product,
      id_client: data.id_client,
      rate: data.rate,
      chat: data.chat,
    })
    const result = await newEvaluate.save();
    if (result) {
      res.json({
        "status": 200,
        "message": "Thêm đánh giá thành công",
        "data": result
      });
    } else {
      res.json({
        "status": 400,
        "message": "Thất bại",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
  }
});
// xoá đánh giá
router.delete("/delete-evaluate-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Evaluate.findByIdAndDelete(id);
    if (result) {
      res.json({
        status: 200,
        messenger: "Xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "tìm và xóa thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//lấy danh sách đánh giá
router.get('/evaluate', async (req, res) => {
  try {
    const { productId } = req.query; // Lấy productId từ query parameter

    // Kiểm tra nếu không có productId được gửi lên
    if (!productId) {
      return res.status(400).json({
        "status": 400,
        "message": "Thiếu productId"
      });
    }

    // Tìm kiếm danh sách đánh giá theo productId
    // const favouriteList = await Favourite.find({ productId }).sort({ createdAt: -1 });
    const evaluateList = await Evaluate.find({ id_product: productId })
      .sort({ createdAt: -1 });
    if (evaluateList.length > 0) {
      res.json({
        "status": 200,
        "message": "Lấy danh sách đánh giá thành công",
        "data": evaluateList
      });
    } else {
      res.json({
        "status": 404,
        "message": "Không có đánh giá nào",
        "data": []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
// Hàm tính tổng giá trị giỏ hàng chỉ với các sản phẩm đã chọn
const calculateTotalPrice = async (products) => {
  let total = 0;
  for (const item of products) {
    if (item.isSelected) { // Chỉ tính cho sản phẩm được chọn
      const product = await Product.findById(item.productId);
      if (product) { // Kiểm tra sản phẩm tồn tại
        total += item.quantity * product.price; // Tính giá của sản phẩm
      }
    }
  }
  return total;
};

// Hàm lấy giá trị giảm giá từ voucher
const getDiscountValue = async (voucherId, totalPrice) => {
  const voucher = await Vouchers.findById(voucherId);
  if (voucher) {
    if (voucher.discountType === 'percent') {
      return (voucher.discountValue / 100) * totalPrice; // Giả định totalPrice đã được tính
    } else {
      return voucher.discountValue; // Giảm giá cố định
    }
  }
  return 0; // Không có giảm giá nếu không tìm thấy voucher
};

// Route thêm sản phẩm vào giỏ hàng
/**
* POST /add-to-cart
* Thêm sản phẩm vào giỏ hàng
* Yêu cầu:
* - userId: ID của người dùng (Firebase)
* - productId: ID của sản phẩm
* - quantity: Số lượng sản phẩm
*/
// Route thêm sản phẩm vào giỏ hàng
router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, quantity, sizeId } = req.body;

  // Kiểm tra xem các trường cần thiết có trong request body hay không
  if (!userId || !productId || !quantity || !sizeId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Tìm sản phẩm trong giỏ hàng và kiểm tra sizeId
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId && p.sizeId.toString() === sizeId);
      if (productIndex !== -1) {
        // Tăng số lượng nếu sản phẩm đã tồn tại trong giỏ hàng và có cùng sizeId
        cart.products[productIndex].quantity += quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng nếu sản phẩm chưa có trong giỏ hàng
        cart.products.push({ productId, quantity, isSelected: false, sizeId });
      }
    } else {
      // Tạo giỏ hàng mới nếu người dùng chưa có giỏ hàng
      cart = new Cart({
        userId,
        products: [{ productId, quantity, isSelected: false, sizeId }]
      });
    }

    // Tính lại tổng giá trị của giỏ hàng
    cart.totalPrice = await calculateTotalPrice(cart.products.filter(item => item.isSelected));

    // Lưu giỏ hàng
    const result = await cart.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      status: 200,
      message: "Product added to cart successfully",
      data: result
    });
  } catch (err) {
    // Trả về lỗi nếu có lỗi xảy ra
    res.status(500).json({ message: err.message });
  }
});
router.post("/update-quantity", async (req, res) => {
  const { userId, productId, sizeId, action } = req.body;

  // Kiểm tra các tham số đầu vào
  if (!userId || !productId || !sizeId || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.sizeId.toString() === sizeId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Xử lý tăng hoặc giảm số lượng
    if (action === "increase") {
      cart.products[productIndex].quantity += 1; // Tăng số lượng 1
    } else if (action === "decrease") {
      cart.products[productIndex].quantity -= 1; // Giảm số lượng 1

      // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Tính lại tổng giá trị giỏ hàng
    cart.totalPrice = await calculateTotalPrice(cart.products.filter(item => item.isSelected));

    // Lưu lại giỏ hàng
    const result = await cart.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      status: 200,
      message: `Quantity ${action === "increase" ? "increased" : "decreased"} successfully`,
      data: result,
    });
  } catch (err) {
    // Trả về lỗi nếu có lỗi xảy ra
    res.status(500).json({ message: err.message });
  }
});


// Route chọn sản phẩm trong giỏ hàng
router.post("/select-products", async (req, res) => {
  const { userId, selectedProductIds } = req.body; // selectedProductIds là mảng ID sản phẩm được chọn

  if (!userId || !Array.isArray(selectedProductIds) || selectedProductIds.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Cập nhật trạng thái sản phẩm được chọn
    cart.products.forEach(product => {
      // Kiểm tra xem sản phẩm có trong danh sách được chọn không (dùng _id thay vì productId)
      if (selectedProductIds.includes(product._id.toString())) {  // Sử dụng _id thay vì productId
        // Đổi trạng thái thành true nếu đang false, và ngược lại
        product.isSelected = !product.isSelected;
      }
    });

    // Tính lại tổng giá trị giỏ hàng dựa trên các sản phẩm đã chọn
    cart.totalPrice = await calculateTotalPrice(cart.products.filter(item => item.isSelected));

    await cart.save();

    res.status(200).json({
      status: 200,
      message: "Selected products updated successfully",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// chọn All
router.post("/select-all-products", async (req, res) => {
  const { userId, isSelected } = req.body; // isSelected xác định trạng thái cần đặt (true hoặc false)

  if (!userId || typeof isSelected !== 'boolean') {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Cập nhật trạng thái tất cả sản phẩm
    cart.products.forEach(product => {
      product.isSelected = isSelected;
    });

    // Tính lại tổng giá trị giỏ hàng nếu chọn tất cả
    if (isSelected) {
      cart.totalPrice = await calculateTotalPrice(cart.products);
    } else {
      cart.totalPrice = 0; // Nếu không chọn sản phẩm nào, tổng giá trị = 0
    }

    await cart.save();

    res.status(200).json({
      status: 200,
      message: `All products ${isSelected ? "selected" : "deselected"} successfully`,
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route chọn voucher trong giỏ hàng
router.post("/select-voucher", async (req, res) => {
  const { userId, voucherId } = req.body;

  if (!userId || !voucherId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Tìm voucher theo voucherId
    const voucher = await Vouchers.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Kiểm tra tổng giá trị giỏ hàng so với minimumOrderValue của voucher
    const totalSelectedPrice = await calculateTotalPrice(cart.products);

    // Kiểm tra giá trị giỏ hàng có đáp ứng điều kiện tối thiểu không
    if (totalSelectedPrice < voucher.minimumOrderValue) {
      return res.status(400).json({
        message: `Total price must be at least ${voucher.minimumOrderValue} to apply this voucher.`
      });
    }

    // Cập nhật trạng thái "isSelected" của voucher trong cơ sở dữ liệu
    voucher.isSelected = true;  // Đánh dấu voucher là đã được chọn
    await voucher.save();  // Lưu thay đổi trạng thái của voucher

    // Cập nhật voucher vào giỏ hàng
    cart.voucher = voucherId;

    // Tính toán giá trị giảm giá từ voucher
    const discountValue = await getDiscountValue(voucherId, totalSelectedPrice);

    // Tính tổng giá sau khi áp dụng voucher
    cart.totalPrice = totalSelectedPrice - discountValue; // Áp dụng giảm giá vào tổng giá trị

    await cart.save();

    res.status(200).json({
      status: 200,
      message: "Voucher selected successfully",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/unselect-voucher", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Tìm giỏ hàng dựa trên userId
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Kiểm tra xem giỏ hàng có voucher đang được áp dụng không
    if (!cart.voucher) {
      return res.status(400).json({ message: 'No voucher is currently selected' });
    }

    // Tìm voucher đang được áp dụng
    const voucher = await Vouchers.findById(cart.voucher);
    if (voucher) {
      // Cập nhật trạng thái "isSelected" của voucher thành false
      voucher.isSelected = false;
      await voucher.save();
    }

    // Loại bỏ voucher khỏi giỏ hàng
    cart.voucher = null;

    // Tính toán lại tổng giá trị giỏ hàng sau khi bỏ voucher
    const totalSelectedPrice = await calculateTotalPrice(cart.products);
    cart.totalPrice = totalSelectedPrice; // Cập nhật lại tổng giá trị giỏ hàng

    await cart.save();

    res.status(200).json({
      status: 200,
      message: "Voucher unselected successfully",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Route lấy danh sách sản phẩm trong giỏ hàng của người dùng
router.get("/get-cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm giỏ hàng của người dùng và populate thông tin sản phẩm và size
    const cart = await Cart.findOne({ userId })
      .populate('products.productId', 'product_name price image') // Lấy thông tin sản phẩm
      .populate('products.sizeId', 'name'); // Lấy thông tin size từ bảng Size

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Trả về danh sách sản phẩm trong giỏ hàng
    res.status(200).json({
      status: 200,
      message: "Get cart successfully",
      data: {
        userId: cart.userId,
        products: cart.products,  // Lấy tất cả sản phẩm và hiển thị thông tin size
        voucher: cart.voucher,
        totalPrice: cart.totalPrice
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/get-order/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId })
      .populate('products.productId', 'product_name price image')
      .populate('products.sizeId', 'name');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Lọc và tái cấu trúc dữ liệu
    const selectedProducts = cart.products
      .filter(product => product.isSelected)
      .map(product => ({
        productId: product.productId,
        sizeId: product.sizeId,
        _id: product._id,
        quantity: product.quantity,
        isSelected: product.isSelected,

      }));

    res.status(200).json({
      status: 200,
      message: "Get cart successfully",
      data: {
        userId: cart.userId,
        products: selectedProducts,
        voucher: cart.voucher,
        totalPrice: cart.totalPrice
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/remove-product", async (req, res) => {
  const { userId, productId } = req.body; // userId: ID của người dùng, productId: ID sản phẩm cần xóa

  if (!userId || !productId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Tìm và xóa sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products.splice(productIndex, 1); // Xóa sản phẩm khỏi giỏ hàng

    // Tính lại tổng giá trị giỏ hàng
    cart.totalPrice = await calculateTotalPrice(cart.products);

    await cart.save();

    res.status(200).json({
      status: 200,
      message: "Product removed from cart successfully",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/*Đơn hàng*/
//Thêm đơn hàng
router.post('/add-order', async (req, res) => {
  try {
    const { id_client, payment_method, products } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id_client || !payment_method || !products || products.length === 0) {
      return res.status(400).json({
        message: "Thiếu dữ liệu cần thiết: id_client, payment_method, hoặc danh sách sản phẩm",
      });
    }

    const normalizedProducts = products.map((product) => ({
      productId: product.productId._id || product.productId,
      sizeId: product.sizeId._id || product.sizeId,
      quantity: product.quantity,
      price: product.price || (product.productId && product.productId.price),
    }));

    // Kiểm tra sản phẩm không hợp lệ
    const invalidProduct = normalizedProducts.find(
      (product) =>
        !product.productId ||
        !product.sizeId ||
        !product.price ||
        isNaN(product.price) ||
        !product.quantity ||
        product.quantity <= 0
    );

    if (invalidProduct) {
      return res.status(400).json({
        message: `Sản phẩm không hợp lệ: ${JSON.stringify(invalidProduct)}`,
      });
    }

    // Tính tổng giá trị đơn hàng
    const totalAmount = normalizedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Tạo đối tượng đơn hàng mới
    const newOrder = new Order({
      id_client,
      products: normalizedProducts,
      state: 0,
      payment_method,
      total_amount: totalAmount,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng đã được thêm thành công",
      order: savedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Có lỗi xảy ra trong quá trình xử lý",
      error: err.message,
    });
  }
});
router.get("/get-list-orders", async (req, res) => {
  try {
    const data = await Order.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        status: 200,
        messenger: "Lấy danh sách thành công",
        data: data,
      });
    } else {
      res.json({
        status: 400,
        messenger: "lấy danh sách thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Cập nhật đơn hàng
router.put('/update-order/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { state } = req.body;

    // Kiểm tra nếu state không được gửi
    if (state === undefined) {
      return res.status(400).json({
        status: 400,
        message: "Yêu cầu không hợp lệ. Vui lòng cung cấp state."
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Đơn hàng không tồn tại"
      });
    }
    order.state = state;

    if (state === 2) {
      order.cancleOrder_time = new Date();
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedOrder = await order.save();

    // Phản hồi thành công
    return res.status(200).json({
      status: 200,
      message: "Cập nhật đơn hàng thành công",
      data: updatedOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Lỗi server"
    });
  }
});


//lấy danh sách đơn hàng
router.get('/orders', async (req, res) => {
  try {
    const { clientId, state } = req.query;

    if (!clientId) {
      return res.status(400).json({ status: 400, message: "Thiếu clientId" });
    }

    if (state === undefined) {
      return res.status(400).json({ status: 400, message: "Thiếu state" });
    }

    const parsedState = parseInt(state);
    if (isNaN(parsedState)) {
      return res.status(400).json({ status: 400, message: "State không hợp lệ" });
    }

    const orderList = await Order.find({ id_client: clientId, state: parsedState })
      .populate({
        path: 'products.productId', 
        model: 'product', 
        select: 'image product_name price' 
      })
      .populate({
        path: 'products.sizeId', 
        model: 'sizes', 
        select: 'name' 
      })
      .sort({ createdAt: -1 });

    const formattedOrders = orderList.map(order => ({
      _id: order._id,
      clientId: order.id_client,
      state: order.state,
      total_amount: order.total_amount,
      order_time: order.order_time,
      cancleOrder_time: order.cancleOrder_time,
      products: order.products.map(product => ({
        productId: product.productId,  
        productName: product.productId.product_name,
        sizeId:product.sizeId,
        quantity: product.quantity,
      })),
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      status: 200,
      message: formattedOrders.length > 0
        ? "Lấy danh sách đơn hàng thành công"
        : "Không có đơn hàng nào phù hợp",
      data: formattedOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
});


router.get('/revenue-statistics', async (req, res) => {
  try {
    // Lấy danh sách đơn hàng đã hoàn thành (state = 1 có thể là đã hoàn thành)
    const completedOrders = await Order.find({ state: 1 }).populate('id_cart');

    // Tính tổng doanh thu
    let totalRevenue = 0;
    completedOrders.forEach(order => {
      totalRevenue += order.total_amount;
    });

    res.json({
      "status": 200,
      "message": "Thống kê doanh thu thành công",
      "data": {
        totalRevenue: totalRevenue,
        totalOrders: completedOrders.length
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
// hoá đơn
router.post('/create-invoice', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('id_cart');

    if (!order) {
      return res.status(404).json({
        "status": 404,
        "message": "Đơn hàng không tồn tại"
      });
    }
    const invoice = {
      invoiceId: order._id,
      clientId: order.id_client,
      products: order.id_cart.products,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      orderTime: order.order_time,
      state: order.statex
    };

    res.status(200).json({
      "status": 200,
      "message": "Hóa đơn được tạo thành công",
      "data": invoice
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server"
    });
  }
});
// Lấy thông tin chi tiết của nhà cung cấp theo ID
router.get('/suppliers/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await suppliers.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({
        "status": 404,
        "message": "Nhà cung cấp không tồn tại"
      });
    }

    res.json({
      "status": 200,
      "message": "Lấy thông tin nhà cung cấp thành công",
      "data": supplier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
// Lấy thông tin chi tiết của loại sản phẩm theo ID
router.get('/typeproduct/:id', async (req, res) => {
  try {
    const typeProductId = req.params.id;
    const typeProduct = await Typeproducts.findById(typeProductId).populate({
      path: 'id_size',
      select: 'name'
    });

    if (!typeProduct) {
      return res.status(404).json({
        "status": 404,
        "message": "Loại sản phẩm không tồn tại"
      });
    }

    res.json({
      "status": 200,
      "message": "Lấy thông tin loại sản phẩm thành công",
      "data": typeProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "status": 500,
      "message": "Lỗi server",
    });
  }
});
module.exports = router;