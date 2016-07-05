//
//  AppDelegate+EnterBackground.m
//  SYLocation
//
//  Created by 陈蜜 on 16/6/22.
//
//

#import "AppDelegate+EnterBackground.h"
#import "MMPDeepSleepPreventer.h"

@implementation AppDelegate (EnterBackground)

- (void)setMMPDeepSleepPreventer
{
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        // 后台运行
        MMPDeepSleepPreventer *deepSleep = [[MMPDeepSleepPreventer alloc] init];
        [deepSleep startPreventSleep];
        //进入后台，保存字符串@“no”，证明程序在前台
        [self cacheApplicationState:@"no"];
    });
    
}

//保存程序当前的状态，，为 yes 时说明程序在后台，为 no 时说明程序在前台
- (void)cacheApplicationState:(NSString *)string {
    NSUserDefaults *users = [NSUserDefaults standardUserDefaults];
    if ([users stringForKey:@"isBack"]) {
        [users removeObjectForKey:@"isBack"];
        [users setValue:string forKey:@"isBack"];
        [users synchronize];
    }else {
        [users setValue:string forKey:@"isBack"];
        [users synchronize];
    }
}

//取出程序当前的状态，，为 yes 时说明程序在后台，为 no 时说明程序在前台
- (BOOL)receiptApplicationState {
    NSUserDefaults *users = [NSUserDefaults standardUserDefaults];
    NSString *string = [users stringForKey:@"isBack"];
    if ([string isEqualToString:@"yes"]) {
        return YES;
    }else
        return NO;
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    [self setMMPDeepSleepPreventer];
    
    //为yes时 程序处在后台
    [self cacheApplicationState:@"yes"];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    //为no时 程序处在前台
    [self cacheApplicationState:@"no"];
}

@end
