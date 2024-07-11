package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-zoox/fetch"
	"github.com/joho/godotenv"
	"github.com/rayshoo/common"
)

var log = common.GetLogger("debug")
var (
	protocol string
	host     string
	port     int
	path     string
	hostName string
	count    int
	debug    bool
	timeout  int
)

func init() {
	var err error
	if _, err := os.Stat(".env"); err == nil {
		err = godotenv.Load(".env")
		if err != nil {
			log.Panic(err)
		}
	}
	if protocol = os.Getenv("PROTOCOL"); protocol == "" {
		protocol = "http"
	}
	if host = os.Getenv("HOST"); host == "" {
		host = "10.254.1.51"
	}
	if port, err = strconv.Atoi(os.Getenv("PORT")); err != nil {
		port = 80
	}
	if path = os.Getenv("REQUEST_PATH"); path == "" {
		path = "/sleep"
	}
	if hostName = os.Getenv("HOST_NAME"); hostName == "" {
		hostName = "modsecurity.test.dev"
	}
	if count, err = strconv.Atoi(os.Getenv("COUNT")); err != nil {
		count = 1
	}
	if d := strings.ToLower(os.Getenv("DEBUG")); d == "true" {
		debug = true
	}
	if timeout, err = strconv.Atoi(os.Getenv("TIMEOUT")); err != nil {
		timeout = 3
	}
}

func main() {
	var wg sync.WaitGroup
	var success, fail int
	for i := 0; i < count; i++ {
		wg.Add(1)
		go func() {
			res, err := fetch.Get(fmt.Sprintf("%s://%s%s", protocol, host, path), &fetch.Config{
				Timeout: time.Duration(timeout) * time.Second,
			})
			if res.Status != 200 || err != nil {
				fail++
			} else {
				success++
			}
			if debug {
				fmt.Println(res.Status)
			}
			wg.Done()
		}()
	}
	wg.Wait()
	log.Infof("success: %d, fail: %d", success, fail)
}
