/*
 * This file is part of the libopencm3 project.
 *
 * Copyright (C) 2010 Gareth McMullin <gareth@blacksphere.co.nz>
 * Copyright (C) 2013 Joshua Harlan Lifton <joshua.harlan.lifton@gmail.com>
 *
 * This library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */

#include "cli_defs.h"
#include <cli.h>
#include <cstring>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/usb/cdc.h>
#include <libopencm3/usb/dwc/otg_fs.h>
#include <libopencm3/usb/usbd.h>
#include <stddef.h>
#include <stdlib.h>

static const struct usb_device_descriptor dev = {
    .bLength = USB_DT_DEVICE_SIZE,
    .bDescriptorType = USB_DT_DEVICE,
    .bcdUSB = 0x0200,
    .bDeviceClass = USB_CLASS_CDC,
    .bDeviceSubClass = 0,
    .bDeviceProtocol = 0,
    .bMaxPacketSize0 = 64,
    .idVendor = 0x0483,
    .idProduct = 0x5740,
    .bcdDevice = 0x0200,
    .iManufacturer = 1,
    .iProduct = 2,
    .iSerialNumber = 3,
    .bNumConfigurations = 1,
};

/*
 * This notification endpoint isn't implemented. According to CDC spec its
 * optional, but its absence causes a NULL pointer dereference in Linux
 * cdc_acm driver.
 */
static const struct usb_endpoint_descriptor comm_endp[] = {{
    .bLength = USB_DT_ENDPOINT_SIZE,
    .bDescriptorType = USB_DT_ENDPOINT,
    .bEndpointAddress = 0x83,
    .bmAttributes = USB_ENDPOINT_ATTR_INTERRUPT,
    .wMaxPacketSize = 16,
    .bInterval = 255,
}};

static const struct usb_endpoint_descriptor data_endp[] = {
    {
        .bLength = USB_DT_ENDPOINT_SIZE,
        .bDescriptorType = USB_DT_ENDPOINT,
        .bEndpointAddress = 0x01,
        .bmAttributes = USB_ENDPOINT_ATTR_BULK,
        .wMaxPacketSize = 64,
        .bInterval = 1,
    },
    {
        .bLength = USB_DT_ENDPOINT_SIZE,
        .bDescriptorType = USB_DT_ENDPOINT,
        .bEndpointAddress = 0x82,
        .bmAttributes = USB_ENDPOINT_ATTR_BULK,
        .wMaxPacketSize = 64,
        .bInterval = 1,
    }};

static const struct {
  struct usb_cdc_header_descriptor header;
  struct usb_cdc_call_management_descriptor call_mgmt;
  struct usb_cdc_acm_descriptor acm;
  struct usb_cdc_union_descriptor cdc_union;
} __attribute__((packed)) cdcacm_functional_descriptors = {
    .header =
        {
            .bFunctionLength = sizeof(struct usb_cdc_header_descriptor),
            .bDescriptorType = CS_INTERFACE,
            .bDescriptorSubtype = USB_CDC_TYPE_HEADER,
            .bcdCDC = 0x0110,
        },
    .call_mgmt =
        {
            .bFunctionLength =
                sizeof(struct usb_cdc_call_management_descriptor),
            .bDescriptorType = CS_INTERFACE,
            .bDescriptorSubtype = USB_CDC_TYPE_CALL_MANAGEMENT,
            .bmCapabilities = 0,
            .bDataInterface = 1,
        },
    .acm =
        {
            .bFunctionLength = sizeof(struct usb_cdc_acm_descriptor),
            .bDescriptorType = CS_INTERFACE,
            .bDescriptorSubtype = USB_CDC_TYPE_ACM,
            .bmCapabilities = 0,
        },
    .cdc_union = {
        .bFunctionLength = sizeof(struct usb_cdc_union_descriptor),
        .bDescriptorType = CS_INTERFACE,
        .bDescriptorSubtype = USB_CDC_TYPE_UNION,
        .bControlInterface = 0,
        .bSubordinateInterface0 = 1,
    }};

static const struct usb_interface_descriptor comm_iface[] = {
    {.bLength = USB_DT_INTERFACE_SIZE,
     .bDescriptorType = USB_DT_INTERFACE,
     .bInterfaceNumber = 0,
     .bAlternateSetting = 0,
     .bNumEndpoints = 1,
     .bInterfaceClass = USB_CLASS_CDC,
     .bInterfaceSubClass = USB_CDC_SUBCLASS_ACM,
     .bInterfaceProtocol = USB_CDC_PROTOCOL_AT,
     .iInterface = 0,
     .endpoint = comm_endp,
     .extra = &cdcacm_functional_descriptors,
     .extralen = sizeof(cdcacm_functional_descriptors)}};

static const struct usb_interface_descriptor data_iface[] = {{
    .bLength = USB_DT_INTERFACE_SIZE,
    .bDescriptorType = USB_DT_INTERFACE,
    .bInterfaceNumber = 1,
    .bAlternateSetting = 0,
    .bNumEndpoints = 2,
    .bInterfaceClass = USB_CLASS_DATA,
    .bInterfaceSubClass = 0,
    .bInterfaceProtocol = 0,
    .iInterface = 0,
    .endpoint = data_endp,
}};

static const struct usb_interface ifaces[] = {{
                                                  .num_altsetting = 1,
                                                  .altsetting = comm_iface,
                                              },
                                              {
                                                  .num_altsetting = 1,
                                                  .altsetting = data_iface,
                                              }};

static const struct usb_config_descriptor config = {
    .bLength = USB_DT_CONFIGURATION_SIZE,
    .bDescriptorType = USB_DT_CONFIGURATION,
    .wTotalLength = 0,
    .bNumInterfaces = 2,
    .bConfigurationValue = 1,
    .iConfiguration = 0,
    .bmAttributes = 0x80,
    .bMaxPower = 0x32,
    .interface = ifaces,
};

static const char *usb_strings[] = {
    "Black Sphere Technologies",
    "CDC-ACM Demo",
    "DEMO",
};

usbd_device *usbd_dev;
cli_t cli;

// clang-format off
static cli_status_t helpFunc(int argc, char **argv) {
  cli.println("help function execute\r\n");
  return CLI_OK;
}
static cli_status_t helloFunc(int argc, char **argv) {
  cli.println("hello world!!!\r\n");
  return CLI_OK;
}
// clang-format on

cmd_t commandTable[] = {{
                            .cmd = "help",
                            .func = helpFunc,
                        },
                        {
                            .cmd = "hello",
                            .func = helloFunc,
                        }};

// clang-format off
/* Buffer to be used for control requests. */
uint8_t usbd_control_buffer[128];

static enum usbd_request_return_codes cdcAcmControlRequest(
    usbd_device *usbd_dev, 
    struct usb_setup_data *req, 
    uint8_t **buf,
    uint16_t *len,
    void (**complete)(usbd_device *usbd_dev, struct usb_setup_data *req)
) {

  (void)complete;
  (void)buf;
  (void)usbd_dev;

  switch (req->bRequest) {
  case USB_CDC_REQ_SET_CONTROL_LINE_STATE: {
    /*
     * This Linux cdc_acm driver requires this to be implemented
     * even though it's optional in the CDC spec, and we don't
     * advertise it in the ACM functional descriptor.
     */

    /* We echo signals back to host as notification. */
    return USBD_REQ_HANDLED;
  }
  case USB_CDC_REQ_SET_LINE_CODING:
    if (*len < sizeof(struct usb_cdc_line_coding)) {
      return USBD_REQ_NOTSUPP;
    }
    return USBD_REQ_HANDLED;
  }
  return USBD_REQ_HANDLED;
}

// clang-format on
static void cdcAcmSendData(char *string) {
  usbd_ep_write_packet(usbd_dev, 0x82, string, strlen(string));
}

static void cdcAcmDataRxCallback(usbd_device *usbd_dev, uint8_t ep) {
  (void)ep;
  char buf[64];
  int len = usbd_ep_read_packet(usbd_dev, 0x01, buf, 64);

  if (len) {
    for (int i = 0; i < len; i++) {
      cli_put(&cli, buf[i]);
    }
    /*usbd_ep_write_packet(usbd_dev, 0x82, buf, len);*/
  }
}

static void cdcAcmSetConfig(usbd_device *usbd_dev, uint16_t wValue) {
  (void)wValue;

  usbd_ep_setup(usbd_dev, 0x01, USB_ENDPOINT_ATTR_BULK, 64,
                cdcAcmDataRxCallback);
  usbd_ep_setup(usbd_dev, 0x82, USB_ENDPOINT_ATTR_BULK, 64, NULL);
  usbd_ep_setup(usbd_dev, 0x83, USB_ENDPOINT_ATTR_INTERRUPT, 16, NULL);

  usbd_register_control_callback(
      usbd_dev, USB_REQ_TYPE_CLASS | USB_REQ_TYPE_INTERFACE,
      USB_REQ_TYPE_TYPE | USB_REQ_TYPE_RECIPIENT, cdcAcmControlRequest);
}

int main(void) {

  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_GPIOA);
  rcc_periph_clock_enable(RCC_OTGFS);
  OTG_FS_GCCFG |= OTG_GCCFG_NOVBUSSENS | OTG_GCCFG_PWRDWN;

  gpio_mode_setup(GPIOA, GPIO_MODE_AF, GPIO_PUPD_NONE, GPIO11);
  gpio_mode_setup(GPIOA, GPIO_MODE_AF, GPIO_PUPD_PULLUP, GPIO12);
  gpio_set_af(GPIOA, GPIO_AF10, GPIO11 | GPIO12);

  // clang-format off
  usbd_dev = usbd_init(
      &otgfs_usb_driver, 
      &dev,
      &config,
      usb_strings,
      3,
      usbd_control_buffer,
      sizeof(usbd_control_buffer));

  // clang-format on
  usbd_register_set_config_callback(usbd_dev, cdcAcmSetConfig);

  cli.println = cdcAcmSendData;
  cli.cmd_tbl = commandTable;
  cli.cmd_cnt = sizeof(commandTable) / sizeof(cmd_t);

  cli_init(&cli);

  while (1) {
    usbd_poll(usbd_dev);
    cli_process(&cli);
  }
}
