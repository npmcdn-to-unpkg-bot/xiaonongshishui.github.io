//
//  SYLocationManager.h
//  SYLocation
//
//  Created by 陈蜜 on 16/6/21.
//
//

#import <Cordova/CDV.h>

@interface SYLocationManager : CDVPlugin

/**
 *  控制台日志输出
 */
- (void)log:(CDVInvokedUrlCommand *)command;

/**
 *  开启或停止定位
 */
- (void)startOrStop:(CDVInvokedUrlCommand *)command;

@end
