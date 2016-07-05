//
//  SYGeographicInformation.h
//  SYLocation
//
//  Created by 陈蜜 on 16/6/21.
//
//

#import <Foundation/Foundation.h>

@interface SYGeographicInformation : NSObject

- (instancetype)initWithDict:(NSDictionary *)dict;

@property (nonatomic, strong) NSString *City;
@property (nonatomic, strong) NSString *Country;
@property (nonatomic, strong) NSString *Name;
@property (nonatomic, strong) NSString *State;
@property (nonatomic, strong) NSString *Street;
@property (nonatomic, strong) NSString *SubLocality;
@property (nonatomic, strong) NSString *Thoroughfare;

@property (nonatomic, strong) NSString *FormattedAddressLine;

@end
