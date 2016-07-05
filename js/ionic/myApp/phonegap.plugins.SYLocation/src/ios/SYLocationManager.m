//
//  SYLocationManager.m
//  SYLocation
//
//  Created by 陈蜜 on 16/6/21.
//
//

#import "SYLocationManager.h"
#import <MapKit/MapKit.h>
#import <CoreLocation/CoreLocation.h>
#import "SYGeographicInformation.h"
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>

typedef NS_ENUM(NSInteger, SYLocationType) {
    /**
     *  坐标
     */
    SYLocationTypeLocation,
    /**
     *  详细地址
     */
    SYLocationTypeAddress,
    /**
     *  城市
     */
    SYLocationTypeCity,
    /**
     *  坐标加详细地址
     */
    SYLocationTypeAll
};

#define IS_IOS8 ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8)


#pragma mark - 定位配置信息
@interface SYLocationInfo : NSObject

@property (nonatomic, assign) SYLocationType locationType;

@property (nonatomic, assign) CLLocationAccuracy locationAccuracy;

@property (nonatomic, strong) CDVInvokedUrlCommand *command;

- (instancetype)initWithCommand:(CDVInvokedUrlCommand *)command;

@end
@implementation SYLocationInfo

//arguments [@"", @"", @""]
/*
 *  1.  type        获取类型 location：坐标  address：详细地址  city：城市  all：坐标加详细地址
 *  2.  accuracy    获取坐标精度  例：kCLLocationAccuracyBest;
 */
- (instancetype)initWithCommand:(CDVInvokedUrlCommand *)command
{
    if (self = [super init]) {
        
        self.command = command;
        
        NSInteger type = [[command.arguments firstObject]integerValue];
        self.locationType = type;
        
        NSInteger accuracy = [[command.arguments objectAtIndex:1]integerValue];
        switch (accuracy) {
            case 0:
            self.locationAccuracy = kCLLocationAccuracyBest;
            break;
            case 1:
            self.locationAccuracy = kCLLocationAccuracyNearestTenMeters;
            break;
            case 2:
            self.locationAccuracy = kCLLocationAccuracyHundredMeters;
            break;
            case 3:
            self.locationAccuracy = kCLLocationAccuracyKilometer;
            break;
            case 4:
            self.locationAccuracy = kCLLocationAccuracyThreeKilometers;
            break;
        }
        
    }
    return self;
}

@end

#pragma mark - 定位管理工具
@interface SYLocationManager () <CLLocationManagerDelegate>

typedef void (^LocationBlock)(CLLocationCoordinate2D locationCoordinate2D);
typedef void (^LocationErrorBlock)(NSError *error);
typedef void (^NSStringBlock)(NSString *cityString);
typedef void (^NSStringBlock)(NSString *addressString);
typedef void (^AllBlock)(NSArray *all);

@property (nonatomic, strong) LocationBlock locationBlock;
@property (nonatomic, strong) NSStringBlock cityBlock;
@property (nonatomic, strong) NSStringBlock addressBlock;
@property (nonatomic, strong) LocationErrorBlock errorBlock;
@property (nonatomic, strong) AllBlock allBlock;

@property (nonatomic, strong) CLLocationManager *manager;
@property (nonatomic, strong) SYLocationInfo *locationInfo;

@property (nonatomic, assign) CLLocationCoordinate2D currentLocation;
@property (nonatomic, strong) SYGeographicInformation *currentGPSInfo;

@end

@implementation SYLocationManager

- (void)log:(CDVInvokedUrlCommand *)command
{
    NSLog(@"%@", [command.arguments firstObject]);
}


- (void)startOrStop:(CDVInvokedUrlCommand *)command
{
    if (command.arguments.count == 0){
        [self stop];
    }else{
        _locationInfo = [[SYLocationInfo alloc]initWithCommand:command];
        
        [self comeBack];
        [self startLocation];
    }
}


/**
 *  构造回调参数
 */
- (void)comeBack
{
    __weak SYLocationManager *mySelf = self;
    switch (_locationInfo.locationType) {
        case SYLocationTypeAddress:{
            self.addressBlock = ^(NSString *addressString){
                [mySelf pluginResultWithComeBack:addressString];
            };
        }
        break;
        case SYLocationTypeLocation:{
            self.locationBlock = ^(CLLocationCoordinate2D locationCoordinate2D){
                [mySelf pluginResultWithComeBack:@[@(locationCoordinate2D.latitude),
                                                   @(locationCoordinate2D.longitude)]];
            };
        }
        break;
        case SYLocationTypeCity:{
            self.cityBlock = ^(NSString *cityString){
                [mySelf pluginResultWithComeBack:cityString];
            };
        }
        break;
        case SYLocationTypeAll:{
            self.allBlock = ^(NSArray *all){
                [mySelf pluginResultWithComeBack:all];
            };
        }
        break;
    }
}


/**
 *  回调方法
 *
 *  @param comeBack 回调的参数
 */
- (void)pluginResultWithComeBack:(id)comeBack
{
    CDVPluginResult* pluginResult = nil;
    
    if(comeBack){
        if ([comeBack isKindOfClass:[NSArray class]]) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:comeBack];
        }else{
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:comeBack];
        }
    }else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Arg was null"];
    }
    
    //这里是通过代理来将数据传递给js中
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_locationInfo.command.callbackId];
    [self stop];
}

/**
 *  开始定位
 */
-(void)startLocation
{
    if (IS_IOS8) {
        if ([CLLocationManager locationServicesEnabled] &&
            [CLLocationManager authorizationStatus] != kCLAuthorizationStatusDenied) {
            
            _manager = [[CLLocationManager alloc]init];
            _manager.delegate = self;
            _manager.desiredAccuracy = kCLLocationAccuracyBest;
            [_manager requestAlwaysAuthorization];
            _manager.distanceFilter = 100;
            [_manager startUpdatingLocation];
        }else{
            UIAlertView *alertView = [[UIAlertView alloc]initWithTitle:@"提示" message:@"需要开启定位服务,请到设置->隐私,打开定位服务" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil];
            [alertView show];
        }
    }else{
        _manager = [[CLLocationManager alloc]init];
        _manager.desiredAccuracy = kCLLocationAccuracyBest;
        _manager.distanceFilter = 100;
        _manager.delegate = self;
        [_manager startUpdatingLocation];
    }
}


#pragma mark - CLLocationDelegate
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(nonnull NSArray<CLLocation *> *)locations
{
    CLLocation *newLocation = [locations lastObject];
    
    CLGeocoder *geocoder=[[CLGeocoder alloc]init];
    [geocoder reverseGeocodeLocation:newLocation completionHandler:^(NSArray *placemarks,NSError *error)
     {
         if (placemarks.count > 0) {
             CLPlacemark *placemark = [placemarks objectAtIndex:0];
             
             _currentGPSInfo = [[SYGeographicInformation alloc]initWithDict:placemark.addressDictionary];
         }
         [self postBlock];
     }];
    
    CLLocationCoordinate2D coor = CLLocationCoordinate2DMake(newLocation.coordinate.latitude, newLocation.coordinate.longitude);//原始坐标
    //转换 google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标至百度坐标
    NSDictionary* testdic = BMKConvertBaiduCoorFrom(coor,BMK_COORDTYPE_COMMON);
    //转换GPS坐标至百度坐标(加密后的坐标)
    testdic = BMKConvertBaiduCoorFrom(coor,BMK_COORDTYPE_GPS);
    NSLog(@"x=%@,y=%@",[testdic objectForKey:@"x"],[testdic objectForKey:@"y"]);
    //解密加密后的坐标字典
    _currentLocation = BMKCoorDictionaryDecode(testdic);//转换后的百度坐标
    
    [self stopLocation];
}


- (void)postBlock
{
    if (_locationBlock) {
        _locationBlock(_currentLocation);
    }
    if (_cityBlock) {
        _cityBlock(_currentGPSInfo.City);
    }
    if (_addressBlock) {
        _addressBlock(_currentGPSInfo.FormattedAddressLine);
    }
    if (_allBlock) {
        _allBlock(@[@(_currentLocation.latitude),@(_currentLocation.longitude),_currentGPSInfo.FormattedAddressLine?_currentGPSInfo.FormattedAddressLine:@""]);
    }
}


/**
 *  停止定位
 */
- (void)stopLocation
{
    if (_manager){
        [_manager stopUpdatingLocation];
        _manager.delegate = nil;
        _manager = nil;
    }
}


//终止持续定位
- (void)stop
{
    [self stopLocation];
    _locationInfo = nil;
    _locationBlock = nil;
    _cityBlock = nil;
    _addressBlock = nil;
    _errorBlock = nil;
    _allBlock = nil;
}


@end
