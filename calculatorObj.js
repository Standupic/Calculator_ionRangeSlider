global.jQuery = require("jquery");
var $ = require("jquery");

var CalculatorObj = (function(){
		var total = 0;
		var basket = {};
		var id = "";
		var text = "";
		var name = ["home","tv","mobile"];

		var homeTv = [{ home: '0', tv: '70', price: 169 }, 
				{ home: '0', tv: '130', price: 349 }, 
				{ home: '0', tv: '150', price: 479 }, 
				{ home: '0', tv: '180', price: 949 }, 

				{ home: '0', tv: '0', price: 0 }, 
				{ home: '50', tv: '0', price: 400 }, 									
				{ home: '100', tv: '0', price: 600 }, 									
				{ home: '150', tv: '0', price: 800 }, 									
				{ home: '300', tv: '0', price: 1750 }, 
				
				{ home: '50', tv: '70', price: 569 }, 
				{ home: '100', tv: '70', price: 769 },
				{ home: '150', tv: '70', price: 969 }, 
				{ home: '300', tv: '70', price: 1919 }, 

				{ home: '50', tv: '130', price: 600 }, 
				{ home: '100', tv: '130', price: 800 }, 
				{ home: '150', tv: '130', price: 950 }, 
				{ home: '300', tv: '130', price: 1900 }, 

				{ home: '50', tv: '150', price: 700 }, 
				{ home: '100', tv: '150', price: 900 }, 
				{ home: '150', tv: '150', price: 1050 }, 
				{ home: '300', tv: '150', price: 2000 }, 

				{ home: '50', tv: '180', price: 1100 }, 
				{ home: '100', tv: '180', price: 1300 }, 
				{ home: '150', tv: '180', price: 1450 },									
				{ home: '300', tv: '180', price: 2400 } ];

		var mobileTarif = [
				{ mobile: '0',price: 0 },  
				{ mobile: '1', price: 150 },  
				{ mobile: '4', price: 400 },  
				{ mobile: '16', price: 590 },  
				{ mobile: '36', price: 890 },  
			];

		var sliders = [
				{selector: "#Wifire_home", range: [0,50,100,150,300], label: ["Выкл","50","100","150","300"]},
				{selector: "#Wifire_tv", range: [0,70,130,150,180], label: ["Выкл","70+","130+","150+","180+"]},
				{selector: "#Wifire_mobile", range: [0,1,4,16,36], label: ["Выкл","1","4","16","36"]}
			];

		var instances = "";
		var rangeInit = function(callback){
				$(sliders).each(function(i,el){
				var current = ""
				$(el['selector']).ionRangeSlider({
					type: "single",
					grid: true,
					from: 0,
					values: el['range'],
					prettify: function(n){
						var index = el.range.indexOf(n)
						return el['label'][index]
					},
					onStart: function(data){
				    	current = data.from;
				    	$(".js-irs-"+i+" .js-grid-text-"+data.from).css("color","#000")
				    },
				    onChange: function(data){
				    	$(".js-irs-"+i+" .js-grid-text-"+current).css("color","#999")
				    },
				    onFinish: function(data){
				    	var arr = $(".js-irs-"+i+" .js-grid-text-"+data.from).siblings();
				    	$(arr).each(function(i,el){
				    		$(el).css("color","#999")
				    	})
				    	$(".js-irs-"+i+" .js-grid-text-"+data.from).css("color","#000");
				    	current = data.from
				    	var index = getIndex(sliders,"#"+$(data.input[0]).attr("id"))
				    	basket[name[index]] = data.from_value
				    	takeValue()
				    }
				})
			})

			var instanceWH = $("#Wifire_home").data("ionRangeSlider");
			var instanceWHTV = $("#Wifire_tv").data("ionRangeSlider");
			var instanceM = $("#Wifire_mobile").data("ionRangeSlider");

			instances = [instanceWH,instanceWHTV,instanceM];

			callback();

		};

		var getIndex = function(array, value) {
			var index;
	   		array.forEach(function(v,i){
	   			if(v.selector == value){
	   				index = i
	   			} 
	   		})
	   		return index
		};


		var handlerClick = function(){
			var data = takeData()
			for(var i = 0; i < data.length; i++){
				$(data[i]).on('click', onClick)
			}
		};
		var repeat = function(){
			var data = takeData();
			$(".slider #"+id+" ."+text).css("color","#000");

			for(var i = 0; i < data[id].length; i++){
				$(data[id][i]).on("click", onClick)
			}
			id = "";
		};
		var takeValue = function(){
			var count = 0;
			var home = 0;
			var tv = 0;
			var mobile = 0;

			for(var key in basket){
	    		count++

	    		if(key == "home"){
	    			home = basket['home']
	    		}
	    		if(key == "tv"){
	    			tv = basket['tv']
	    		}
	    		if(key == "mobile"){
	    			mobile = basket['mobile']
	    		}
	    	}

	    	if(basket['home'] == 0){
	    		count--
	    	}
	    	if(basket['tv'] == 0){
	    		count--
	    	}
	    	if(basket['mobile'] == 0){
	    		count--
	    	}

	    	console.log(count, "count")
	    	var saleSize = count == 2 ? 20 : count == 3 ? 30 : 0

	    	var priceHomeTv = homeTv.filter(function(obj){return obj.home == home && obj.tv == tv})[0].price

	    	var priceMobile = mobileTarif.filter(function(obj){return obj.mobile == mobile})[0].price
		
			

	    	priceMobile  = saleSize == 0 ? priceMobile : Math.round(priceMobile * (1 - saleSize / 100));

	    	total = priceHomeTv + priceMobile

	    	$(".total > strong").text(total)
		};
		var takeData = function(){
			var data =  $(".range_slider .slider .irs-grid")
			var arr = []
			for(var i = 0 ; i < data.length; i++){
				arr.push($(data[i]).find(".irs-grid-text"))
			}
			return arr
		};
		var onClick = function(){
			text = ($(this).attr("class").split(" ")[1])
			
			id = $(this).parent().parent().attr("id");

			var string = $(this).attr("class");

			instances[id].update({
				from: string.replace(/irs-grid-text js-grid-text-/gi,"")
			})

			var value = $(this).text()

			if(value == "Выкл"){
				basket[name[id]] = value = 0
			}else{
				console.log(value,"value")
				basket[name[id]] = value.match(/\d+/g)[0]
			}
			takeValue()
			
			if(id != "") repeat(id)
		}
	return{
		init: rangeInit(handlerClick)
	}
}())

module.exports = CalculatorObj;
