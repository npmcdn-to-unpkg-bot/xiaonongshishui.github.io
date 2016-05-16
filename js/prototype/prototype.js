// //超类  构造函数
// function Father(){
// 	this.fname = "父"
// }
// Father.prototype.getFName = function(){
// 	return this.fname;
// }
// //子类 构造函数
// function Son(){
// 	this.sname = "子";
// }
// //继承 SuperType
// Son.prototype = new Father();

// Son.prototype.getSName = function(){
// 	return this.sname;
// }
// var instance = new Son();
// alert(instance.getFName());
// alert(instance.getSName());
// alert(instance instanceof Object);
// alert(instance instanceof Father);
// alert(instance instanceof Son);




// function SuperType(){
// 	this.colors = ["red","blue","green"];
// }
// function SubType(){
// 	SuperType.call(this);
// }
// var instance1 = new SubType();
// instance1.colors.push("black");
// alert(instance1.colors);

// var instance2 = new SubType();
// alert(instance2.colors); 

function SuperType(name){
	this.name = name;
	this.colors = ["red","blue","green"];
}
SuperType.prototype.sayName = function(){
	alert(this.name);
}
function SubType(name,age){
	SuperType.call(this,name);
	this.age = age;
}
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
	alert(this.age);
}

var instance1 = new SubType("Nicholas",29);
instance1.colors.push["black"];
alert(instance1.colors);
instance1.sayName();
instance1.sayAge();

var instance2 = new SubType("Greg",27);
alert(instance2.colors);
instance2.sayName();
instance2.sayAge();



function Foo(name,year){
	this.name = name;
	this.year = year;
	console.log(this);
}
var f1 = new Foo("AAA",1990);

console.log(f1.name);
console.log(f1.year);