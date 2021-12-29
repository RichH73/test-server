module.exports = () => {
    const items = [ 
        {
        sku : "091661462634",
        quantity : 1,
        priceAdjustments : [ 
            {
          promotionId : "TRANSACTION_DEAL",
          reasonCode : "DEAL",
          adjustmentAmount : 10.0
        } 
      ],
        giftBox : false
      }, 
      {
        sku : "091661462634",
        quantity : 1,
        priceAdjustments : [ 
            {
          promotionId : "TRANSACTION_DEAL",
          reasonCode : "DEAL",
          adjustmentAmount : 10.0
        }, 
        {
          promotionId : "MANUALDOLLAR",
          reasonCode : "LINE_ITEM_DISCOUNT",
          adjustmentAmount : 15
        } 
      ],
        giftBox : false
      },
      {
        sku : "091661462634",
        quantity : 1,
        priceAdjustments : [ 
            {
          promotionId : "TRANSACTION_DEAL",
          reasonCode : "DEAL",
          adjustmentAmount : 10.0
        }, 
        {
          promotionId : "MANUALDOLLAR",
          reasonCode : "LINE_ITEM_DISCOUNT",
          adjustmentAmount : 15
        } 
      ],
        giftBox : false
      },
      {
        sku : "09166146262",
        quantity : 1,
        priceAdjustments : [ 
            {
          promotionId : "TRANSACTION_DEAL",
          reasonCode : "DEAL",
          adjustmentAmount : 10.0
        } 
      ],
        giftBox : false
      }
      ]
      
      var output = [];
      let newAdjustments = []


      const newPromoCodes = (items) => {
        const { priceAdjustments = [] } = items
        priceAdjustments.forEach((item) => {
          let existing = newAdjustments.filter((i) => {
            return i.promotionId == item.promotionId
          })
          
          if(existing.length) {
            let existingIndex = newAdjustments.indexOf(existing[0])
            console.log('adjust', {
              totalPrice: newAdjustments[existingIndex].adjustmentAmount + newAdjustments[existingIndex].adjustmentAmount,
              name: newAdjustments[existingIndex].promotionId
            })
            newAdjustments[existingIndex].adjustmentAmount = newAdjustments[existingIndex].adjustmentAmount
          } else {
            newAdjustments.push(item)
          }


        })
        return newAdjustments
      }



      /*
        Loops over all items and adds all instances of the same SKU into one upbject. Then it send that object up to do the same for priceAdjustments
      */
      items.forEach((item) => {
        let adjustedQuantity = 0
        let existing = output.filter((v) => {

          return v.sku == item.sku;
        });

        if (existing.length) {
          let existingIndex = output.indexOf(existing[0]);
          output[existingIndex].priceAdjustments = output[existingIndex].priceAdjustments.concat(item.priceAdjustments);
          output[existingIndex].quantity = output[existingIndex].newQuan + output[existingIndex].quantity;
        } else {
          Object.assign(item, {additional: newPromoCodes(item)})
          Object.assign(item, {newQuan: adjustedQuantity + 1})
          output.push(item);
        }
      });

return output
}


