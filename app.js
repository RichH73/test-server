const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const routes = require("./routes/index");
const _ = require("lodash");
const { forOwn, get } = require("lodash");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes );
const PORT = 8000


const transactions = require('./storeTransactions.json') // Full list
const response = require('./storeTransactions.json') // Full list
const sts = require('./singleTransaction.json') // Single order, has shipments.
const ecom = require('./ecom.json') // Single order, has shipments.
const single_ecom = require('./single_ecom.json') // Single order, has shipments.
const transform = require('./ecom_purchase_history') // The transform that will make the final return to concierge.
const nonsts = require('./non_sts.json') // Single order that has no shipments, only orderLines



const transaction_list = (response) => {
    if(_.isArray(response)){
        const transaction_array = []
        response.map(transaction => {
            transaction_array.push(transform(transaction))
        })
        return {
            transactionType: "storeTransactions",
            transactions: transaction_array
        }
    }
    return {
        transactions: []
    }
}

const ecom_purchases = (response) => {
    if(_.isArray(response)){
        const transaction_array = []
        response.map(transaction => {
            transaction_array.push(transform(transaction))
        })
        return {
            transactionType: "storeTransactions",
            transactions: transaction_array
        }
    }
    return {
        transactions: []
    }
}





const reply = (req, res) => {
    res.status(200).send(ecom_purchases(transactions))
}


//console.log(get_item(singleTransaction))


app.get('/', reply)



const shipments = (order_details) => {
    return order_details.map((value) => {
        return {
            id: _.get(value, 'upc'),
            name: _.get(value, 'name'),
            sku: _.get(value, 'upc'),
            image: _.get(value, 'imageURL', '').replace(/amp;+/g, ''),
            price: _.get(value, 'purchasePrice', 0),
            details: [
                {
                    label: 'UPC: ',
                    value: _.get(value, 'vendorUPC')
                },
                {
                    label: 'Item Price: ',
                    value: _.get(value, 'purchasePrice', 0)
                },
                {
                    label: 'Quantity: ',
                    value: _.get(value, 'orderedQty')
                },
                {
                    label: 'Size: ',
                    value: _.get(value, 'sizeDesc')
                },
                {
                    label: 'Color: ',
                    value: _.get(value, 'colorDesc')
                },
                {
                    label: 'Status: ',
                    value: _.get(value, 'lineStatus')
                }
            ]
        }
    })
}

const data_type = (detail) => {
    const sale_type = _.includes(_.get(detail, 'orderType'), 'STS')
    let order_array = []
    if(!!sale_type) {
        _.flatMap(_.get(detail, 'shipments', 'none')).map(t => {
            order_array.push(t.orderLines)
        })
    }
    if(!sale_type) {
        order_array.push(_.get(detail, 'orderLines'))
    }
    return _.compact(_.flatten(order_array))
}

const data_mapping = (response) => {
    const transaction_breakdown = response.map((detail) => {
        return {
            // transactionNumber: _.get(detail, 'orderNumber'),
            // transactionDate: _.get(detail, 'capturedDate'),
            // transactionType: _.get(detail, 'orderType'),
            // currency: 'USD',
            transactionNumber: _.get(detail, 'orderNumber'),
            transactionDate: _.get(detail, 'capturedDate'),
            currency: 'USD',
            items: shipments(data_type(detail))
        }
    })
    return {
        transactionType: 'storeTransactions',
        transactions: transaction_breakdown
    }
}
app.listen(PORT, function(){
    console.log(`Listening on port: `, PORT)
});