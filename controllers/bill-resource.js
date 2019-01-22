const Joi = require('joi');
const Bill = require('../models/bill');

class BillResource{
    index(req, res){
        res.send('please specify bill id');
    }

    store(req,res){
        const { error } = this._validateItems(req.body);
        if(error) return res.status(422).json({ error: error.details[0].message });

        const insertKey = 'name, tax_code_id, price';
        let insetValues = [];
        req.body.items.forEach(item => {
            insetValues.push(Object.values(item));
        });

        Bill.create(insertKey, insetValues, (err, result) =>{
            if(err){
                return res.status(500).json({ error: 'failed to create bill' });
            }
            else{
                return res.status(201).json(this._countBill(result));
            }
        });
    }

    show(req, res){
        const schema = Joi.number().positive();
        const { error } = Joi.validate(req.params.billId, schema);
        if(error) return res.status(422).json({ error: error.details[0].message });

        Bill.getById(req.params.billId, (err, result) =>{
            if(err){
                return res.status(500).json({ error: 'failed to get the bill' });
            }
            else{
                if(result.length == 0)
                    return res.status(404).json({ error: 'bill not found' });

                return res.json(this._countBill(result));
            }
        });
    }

    delete(req, res){
        const schema = Joi.number().positive();
        const { error } = Joi.validate(req.params.billId, schema);
        if(error) return res.status(422).json({ error: error.details[0].message });

        Bill.deleteById(req.params.billId, (err, result) =>{
            if(err){
                return res.status(500).json({ error: 'failed to get the bill' });
            }
            else{
                return res.json({ affected_row: result.rowCount});
            }
        });
    }

    update(req,res){
        //validate billId
        const schema = Joi.number().positive();
        const validation = Joi.validate(req.params.billId, schema);
        if(validation.error) return res.status(422).json({ error: error.details[0].message });

        //validate items
        const { error } = this._validateItems(req.body);
        if(error) return res.status(422).json({ error: error.details[0].message });

        const insertKey = 'name, tax_code_id, price';
        let insetValues = [];
        req.body.items.forEach(item => {
            insetValues.push(Object.values(item));
        });

        Bill.update(req.params.billId, insertKey, insetValues, (err, result) =>{
            if(err){
                return res.status(500).json({ error: 'failed to get the bill' });
            }
            else{
                if(result.length == 0)
                    return res.status(404).json({ error: 'bill not found' });

                return res.status(200).json(this._countBill(result));
            }
        });
    }
    
    _validateItems(reqBody){
        const item = Joi.object().keys({
            name: Joi.string().required(),
            tax_code: Joi.number().positive(),
            price: Joi.number().positive()
        });
        
        const items_schema = Joi.object({
            items: Joi.array().min(1).items(item).required()
          });
        
        return Joi.validate(reqBody, items_schema);
    }

    _countBill(items){
        let priceSubtotal = 0;
        let taxSubtotal = 0;
        let grandTotal = 0;
        const billId = items[0].bill_id;
        items.forEach(item => {
            if(item.tax_code_id == 1){     //tax = 10% of price; refundable
                item.tax = item.price*0.1;
                item.refundable = true;
            }
            else if(item.tax_code_id == 2){      //tax = 10 + 2% of price; not refundable
                item.tax = 10+ item.price*0.02;
                item.refundable = false;
            }
            else if(item.tax_code_id == 3){     //tax = 1% of (price-100); refundable
                item.tax = (item.price-100)*0.01;

                item.refundable = false;
            }
            item.tax_code = item.tax_code_id; //change the name for tax_code
            delete item.tax_code_id;          //to match what client sends during create

            delete item.id; //delete id because it'll change everytime users update a bill
            delete item.bill_id; //delete bill_id because it'll be displayed outside of items array

            item.amount = item.price+item.tax;
            priceSubtotal += item.price;
            taxSubtotal += item.tax;
            grandTotal += item.amount;
        });

        return {
            bill_id: billId,
            items: items,
            price_subtotal: priceSubtotal,
            tax_subtotal: taxSubtotal,
            grand_total: grandTotal
        }
    }
}

module.exports = new BillResource();
